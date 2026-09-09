"""
Text Preprocessing and Feature Engineering for CineMatch AI
"""
import re
from typing import List, Dict, Any, Optional

def clean_text(text: Optional[str]) -> str:
    """Clean and normalize raw text strings."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def build_soup(movie: Dict[str, Any]) -> str:
    """
    Create a rich, weighted feature 'soup' for content-based vectorization.
    Combines overview, tagline, genres (repeated for weight), keywords, cast, and director.
    """
    overview = clean_text(movie.get("overview", ""))
    tagline = clean_text(movie.get("tagline", ""))
    
    genres = movie.get("genres", [])
    genre_str = " ".join([clean_text(g if isinstance(g, str) else g.get("name", "")) for g in genres])
    weighted_genres = f"{genre_str} {genre_str}"
    
    keywords = movie.get("keywords", [])
    kw_str = " ".join([clean_text(k if isinstance(k, str) else k.get("keyword", "")) for k in keywords])
    weighted_keywords = f"{kw_str} {kw_str}"
    
    cast = movie.get("cast", [])
    cast_names = []
    for c in cast[:4]:
        name = c if isinstance(c, str) else c.get("name", "")
        cleaned = clean_text(name).replace(" ", "_")
        if cleaned:
            cast_names.append(cleaned)
    cast_str = " ".join(cast_names)
    
    directors = movie.get("directors", [])
    director_names = []
    for d in directors:
        name = d if isinstance(d, str) else d.get("name", "")
        cleaned = clean_text(name).replace(" ", "_")
        if cleaned:
            director_names.append(cleaned)
    director_str = " ".join(director_names)
    weighted_director = f"{director_str} {director_str} {director_str}"
    
    soup = f"{overview} {tagline} {weighted_genres} {weighted_keywords} {cast_str} {weighted_director}".strip()
    return soup
