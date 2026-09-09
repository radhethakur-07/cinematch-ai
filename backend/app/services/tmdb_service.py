import os
import time
import httpx
from typing import List, Dict, Any, Optional, Tuple
from backend.app.core.config import settings
from backend.app.core.logging import logger

TMDB_BASE_URL = "https://api.themoviedb.org/3"
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p"

class TMDBService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.TMDB_API_KEY
        self._cache: Dict[str, Tuple[float, Any]] = {}
        self.cache_ttl = 3600 # 1 hour TTL

    def _get_from_cache(self, key: str) -> Optional[Any]:
        if key in self._cache:
            ts, val = self._cache[key]
            if time.time() - ts < self.cache_ttl:
                return val
            del self._cache[key]
        return None

    def _set_cache(self, key: str, val: Any):
        self._cache[key] = (time.time(), val)

    async def _fetch(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.warning("[TMDB Service] TMDB_API_KEY is not configured. External TMDB queries disabled.")
            return None

        cache_key = f"{endpoint}:{sorted(params.items()) if params else ''}"
        cached = self._get_from_cache(cache_key)
        if cached:
            return cached

        req_params = {"api_key": self.api_key, "language": "en-US"}
        if params:
            req_params.update(params)

        url = f"{TMDB_BASE_URL}{endpoint}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, params=req_params)
                if resp.status_code == 200:
                    data = resp.json()
                    self._set_cache(cache_key, data)
                    return data
                else:
                    logger.warning(f"[TMDB Service] TMDB API returned {resp.status_code} for {endpoint}")
                    return None
        except Exception as e:
            logger.error(f"[TMDB Service] Error contacting TMDB: {e}")
            return None

    async def get_popular(self, page: int = 1) -> List[Dict[str, Any]]:
        data = await self._fetch("/movie/popular", {"page": page})
        return data.get("results", []) if data else []

    async def get_trending(self, time_window: str = "week") -> List[Dict[str, Any]]:
        data = await self._fetch(f"/trending/movie/{time_window}")
        return data.get("results", []) if data else []

    async def get_top_rated(self, page: int = 1) -> List[Dict[str, Any]]:
        data = await self._fetch("/movie/top_rated", {"page": page})
        return data.get("results", []) if data else []

    async def search_movies(self, query: str, page: int = 1) -> List[Dict[str, Any]]:
        data = await self._fetch("/search/movie", {"query": query, "page": page, "include_adult": "false"})
        return data.get("results", []) if data else []

    async def get_movie_details(self, movie_id: int) -> Optional[Dict[str, Any]]:
        data = await self._fetch(f"/movie/{movie_id}", {"append_to_response": "credits,videos,keywords"})
        return data

    async def get_genres(self) -> List[Dict[str, Any]]:
        data = await self._fetch("/genre/movie/list")
        return data.get("genres", []) if data else []

tmdb_service = TMDBService()
