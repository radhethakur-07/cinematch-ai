import os
import json
import re
from typing import Dict, Any, Optional
import google.generativeai as genai
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.schemas.ai import StructuredMovieIntent

GENRE_KEYWORDS = {
    "action": "Action",
    "adventure": "Adventure",
    "animation": "Animation",
    "anime": "Animation",
    "cartoon": "Animation",
    "comedy": "Comedy",
    "funny": "Comedy",
    "crime": "Crime",
    "heist": "Crime",
    "gangster": "Crime",
    "documentary": "Documentary",
    "drama": "Drama",
    "emotional": "Drama",
    "family": "Family",
    "fantasy": "Fantasy",
    "magic": "Fantasy",
    "history": "History",
    "historical": "History",
    "horror": "Horror",
    "scary": "Horror",
    "spooky": "Horror",
    "music": "Music",
    "musical": "Music",
    "mystery": "Mystery",
    "whodunit": "Mystery",
    "romance": "Romance",
    "romantic": "Romance",
    "love": "Romance",
    "sci-fi": "Science Fiction",
    "scifi": "Science Fiction",
    "science fiction": "Science Fiction",
    "space": "Science Fiction",
    "thriller": "Thriller",
    "suspense": "Thriller",
    "dark": "Thriller",
    "war": "War",
    "western": "Western"
}

class AIService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel("gemini-1.5-flash")
                self.available = True
            except Exception as e:
                logger.error(f"[AI Service] Failed to configure Gemini API: {e}")
                self.available = False
        else:
            self.available = False
            logger.info("[AI Service] GEMINI_API_KEY not set. Using heuristic fallback parser.")

    def _fallback_parse(self, prompt: str) -> StructuredMovieIntent:
        """Heuristic rule-based fallback when Gemini is unavailable."""
        prompt_lower = prompt.lower()
        matched_genres = []
        for kw, genre in GENRE_KEYWORDS.items():
            if re.search(rf"\b{kw}\b", prompt_lower) and genre not in matched_genres:
                matched_genres.append(genre)

        # Detect runtime constraints, e.g. "under 2 hours", "short", "less than 90 min"
        max_runtime = None
        if "short" in prompt_lower or "quick" in prompt_lower or "not too long" in prompt_lower:
            max_runtime = 110
        runtime_match = re.search(r"(\d+)\s*(min|minute|hour|hr)", prompt_lower)
        if runtime_match:
            num = int(runtime_match.group(1))
            unit = runtime_match.group(2)
            if "hour" in unit or "hr" in unit:
                max_runtime = num * 60
            else:
                max_runtime = num

        # Extract potential movie references, e.g. "like Inception", "similar to Interstellar"
        similar_to = []
        sim_match = re.findall(r"(?:like|similar to|vibes of)\s+([A-Za-z0-9\s:]{3,30})", prompt, re.IGNORECASE)
        for s in sim_match:
            cleaned = s.strip()
            # Stop at common punctuation or words
            cleaned = re.split(r"\b(but|and|with|without|not)\b", cleaned)[0].strip()
            if cleaned and len(cleaned) > 2:
                similar_to.append(cleaned)

        # Detect mood descriptors
        mood_words = ["emotional", "dark", "mind-bending", "inspirational", "philosophical", "feel-good", "intense", "cozy", "gritty", "surreal"]
        detected_moods = [m for m in mood_words if m in prompt_lower]

        return StructuredMovieIntent(
            genres=matched_genres or ["Science Fiction", "Drama"],
            moods=detected_moods or ["thought-provoking"],
            similar_to=similar_to,
            max_runtime=max_runtime,
            min_rating=7.0,
            keywords=[w for w in prompt_lower.split() if len(w) > 4][:5],
            reasoning="Extracted via CineMatch heuristic intent parser"
        )

    async def parse_natural_language_intent(self, prompt: str) -> tuple[StructuredMovieIntent, bool]:
        """
        Convert user natural language input into structured intent schema.
        Returns (StructuredMovieIntent, fallback_used).
        """
        if not self.available:
            return self._fallback_parse(prompt), True

        system_instruction = """
You are an expert cinematic assistant. Your task is to translate a user's natural language movie description into a strictly valid JSON object matching the requested schema.
Do NOT invent fake movie titles. Extract the user's intent:
Schema:
{
  "genres": ["list of standard TMDB genres like Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Music, Mystery, Romance, Science Fiction, Thriller, War, Western"],
  "moods": ["list of mood adjectives like dark, emotional, uplifting, mind-bending, intense, nostalgic"],
  "similar_to": ["movie titles mentioned directly by the user as reference points"],
  "max_runtime": null or integer minutes (e.g. 120),
  "min_rating": null or float between 1.0 and 9.0 (e.g. 7.5),
  "keywords": ["specific thematic elements like space, heist, time travel, multiverse, detective"],
  "reasoning": "brief explanation of mapping"
}
Return ONLY valid JSON.
"""
        try:
            full_prompt = f"{system_instruction}\n\nUser request: \"{prompt}\"\nJSON Response:"
            response = self.model.generate_content(full_prompt)
            raw_text = response.text.strip()
            
            # Clean possible markdown fence
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            raw_text = raw_text.strip()

            parsed_dict = json.loads(raw_text)
            intent = StructuredMovieIntent(**parsed_dict)
            return intent, False
        except Exception as e:
            logger.warning(f"[AI Service] Gemini inference failed or returned invalid JSON ({e}). Falling back to heuristic parser.")
            return self._fallback_parse(prompt), True

ai_service = AIService()
