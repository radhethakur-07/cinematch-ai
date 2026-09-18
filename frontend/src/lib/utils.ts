import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRuntime(minutes?: number): string {
  if (!minutes) return "N/A";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function formatReleaseYear(releaseDate?: string): string {
  if (!releaseDate) return "N/A";
  return new Date(releaseDate).getFullYear().toString();
}

export const MOVIE_IMAGE_OVERRIDES: Record<
  string | number,
  { poster: string; backdrop: string }
> = {
  "mirzapur: the movie": {
    poster: "https://m.media-amazon.com/images/M/MV5BZjhlYWY1NWUtYjU4Zi00MDg4LWE2N2MtYjQzMjBkMjgwOWI5XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://i.ytimg.com/vi/5vMWZhHPlaw/maxresdefault.jpg",
  },
  804680: {
    poster: "https://m.media-amazon.com/images/M/MV5BZjhlYWY1NWUtYjU4Zi00MDg4LWE2N2MtYjQzMjBkMjgwOWI5XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://i.ytimg.com/vi/5vMWZhHPlaw/maxresdefault.jpg",
  },
  34339725: {
    poster: "https://m.media-amazon.com/images/M/MV5BZjhlYWY1NWUtYjU4Zi00MDg4LWE2N2MtYjQzMjBkMjgwOWI5XkEyXkFqcGc@._V1_.jpg",
    backdrop: "https://i.ytimg.com/vi/5vMWZhHPlaw/maxresdefault.jpg",
  },
  "mirzapur": {
    poster: "https://m.media-amazon.com/images/M/MV5BZTFjMzMxZTUtYTMyNy00OWNhLTk4ODQtNGI1NjI1NjJhMzc3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/33o3s4Vs4Sw/maxresdefault.jpg",
  },
  82583: {
    poster: "https://m.media-amazon.com/images/M/MV5BZTFjMzMxZTUtYTMyNy00OWNhLTk4ODQtNGI1NjI1NjJhMzc3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/33o3s4Vs4Sw/maxresdefault.jpg",
  },
  84105: {
    poster: "https://m.media-amazon.com/images/M/MV5BZTFjMzMxZTUtYTMyNy00OWNhLTk4ODQtNGI1NjI1NjJhMzc3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/33o3s4Vs4Sw/maxresdefault.jpg",
  },
  "panchayat": {
    poster: "https://m.media-amazon.com/images/M/MV5BNjMwYWMxNjYtY2I2NC00OWE0LTg4MmQtMmI5ZGI2NzU4ODhiXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/mojZJ7oeD_g/maxresdefault.jpg",
  },
  101088: {
    poster: "https://m.media-amazon.com/images/M/MV5BNjMwYWMxNjYtY2I2NC00OWE0LTg4MmQtMmI5ZGI2NzU4ODhiXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/mojZJ7oeD_g/maxresdefault.jpg",
  },
  "kota factory": {
    poster: "https://m.media-amazon.com/images/M/MV5BY2U5MjY1NWEtZDI2MS00NTlhLWEyODQtYzE0MzY3NDUyNzE3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/pNZQ6msbO38/maxresdefault.jpg",
  },
  9432978: {
    poster: "https://m.media-amazon.com/images/M/MV5BY2U5MjY1NWEtZDI2MS00NTlhLWEyODQtYzE0MzY3NDUyNzE3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/pNZQ6msbO38/maxresdefault.jpg",
  },
  87739: {
    poster: "https://m.media-amazon.com/images/M/MV5BY2U5MjY1NWEtZDI2MS00NTlhLWEyODQtYzE0MzY3NDUyNzE3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/pNZQ6msbO38/maxresdefault.jpg",
  },
  "special ops": {
    poster: "https://m.media-amazon.com/images/M/MV5BN2E3OTI0OGItMWRhMi00NjU1LTk1ZTctMDEwOWZiMDczOWNlXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/GF0H5DZAE2g/maxresdefault.jpg",
  },
  "special ops 1.5": {
    poster: "https://m.media-amazon.com/images/M/MV5BN2E3OTI0OGItMWRhMi00NjU1LTk1ZTctMDEwOWZiMDczOWNlXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/GF0H5DZAE2g/maxresdefault.jpg",
  },
  11854694: {
    poster: "https://m.media-amazon.com/images/M/MV5BN2E3OTI0OGItMWRhMi00NjU1LTk1ZTctMDEwOWZiMDczOWNlXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/GF0H5DZAE2g/maxresdefault.jpg",
  },
  991202: {
    poster: "https://m.media-amazon.com/images/M/MV5BN2E3OTI0OGItMWRhMi00NjU1LTk1ZTctMDEwOWZiMDczOWNlXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/GF0H5DZAE2g/maxresdefault.jpg",
  },
  "dhurandhar": {
    poster: "https://upload.wikimedia.org/wikipedia/en/c/ce/Dhurandhar_poster.jpg",
    backdrop: "https://i.ytimg.com/vi/NHk7scrb_9I/maxresdefault.jpg",
  },
  991201: {
    poster: "https://upload.wikimedia.org/wikipedia/en/c/ce/Dhurandhar_poster.jpg",
    backdrop: "https://i.ytimg.com/vi/NHk7scrb_9I/maxresdefault.jpg",
  },
  "pritam and pedro": {
    poster: "https://m.media-amazon.com/images/M/MV5BMDY4NDc1MjYtMDQyOS00YzgzLTg2MmEtNjI0MGVhODRiMDMzXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/uCjkRVV0-qU/maxresdefault.jpg",
  },
  928172: {
    poster: "https://m.media-amazon.com/images/M/MV5BMDY4NDc1MjYtMDQyOS00YzgzLTg2MmEtNjI0MGVhODRiMDMzXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/uCjkRVV0-qU/maxresdefault.jpg",
  },
  243206: {
    poster: "https://m.media-amazon.com/images/M/MV5BMDY4NDc1MjYtMDQyOS00YzgzLTg2MmEtNjI0MGVhODRiMDMzXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/uCjkRVV0-qU/maxresdefault.jpg",
  },
  "sacred games": {
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyODc1MDAtNTg0ZC00MjRhLTg1NzctM2NjYTlmOGMwYWNiXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/28j8h0RRsf4/maxresdefault.jpg",
  },
  6077448: {
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyODc1MDAtNTg0ZC00MjRhLTg1NzctM2NjYTlmOGMwYWNiXkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/28j8h0RRsf4/maxresdefault.jpg",
  },
  "the family man": {
    poster: "https://m.media-amazon.com/images/M/MV5BZjM3YTczOWQtNjkzNi00ZTRlLThkZWEtZjgwZGVmODhkMDU3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/NGf_B81Ls2o/maxresdefault.jpg",
  },
  9544034: {
    poster: "https://m.media-amazon.com/images/M/MV5BZjM3YTczOWQtNjkzNi00ZTRlLThkZWEtZjgwZGVmODhkMDU3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/NGf_B81Ls2o/maxresdefault.jpg",
  },
  "paatal lok": {
    poster: "https://m.media-amazon.com/images/M/MV5BM2NlZDUwNzAtZTgyYi00YjhlLThhZTEtYTIxMzdjZjVkOTI3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/cNwfZ_x_Q0k/maxresdefault.jpg",
  },
  9680440: {
    poster: "https://m.media-amazon.com/images/M/MV5BM2NlZDUwNzAtZTgyYi00YjhlLThhZTEtYTIxMzdjZjVkOTI3XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/cNwfZ_x_Q0k/maxresdefault.jpg",
  },
  "farzi": {
    poster: "https://m.media-amazon.com/images/M/MV5BNDY2OWMxNzgtZGQ4Ny00ODI3LTk3MTAtYjM4N2U4ZGI3ZGY1XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/4nh_yE-Kz_k/maxresdefault.jpg",
  },
  15477488: {
    poster: "https://m.media-amazon.com/images/M/MV5BNDY2OWMxNzgtZGQ4Ny00ODI3LTk3MTAtYjM4N2U4ZGI3ZGY1XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/4nh_yE-Kz_k/maxresdefault.jpg",
  },
  "asur": {
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkOGQzMjItNTliOC00NTIxLTg4ODEtNTMxZWY1OTk5ZWM0XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/LDIR3cx3Q4Y/maxresdefault.jpg",
  },
  11912196: {
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkOGQzMjItNTliOC00NTIxLTg4ODEtNTMxZWY1OTk5ZWM0XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/LDIR3cx3Q4Y/maxresdefault.jpg",
  },
  "scam 1992": {
    poster: "https://m.media-amazon.com/images/M/MV5BNGRkOTVjODgtNTBmZS00MDQ3LWE3ZjQtM2ZiNDQ3OWJkMjM2XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/ISORfez27og/maxresdefault.jpg",
  },
  12392504: {
    poster: "https://m.media-amazon.com/images/M/MV5BNGRkOTVjODgtNTBmZS00MDQ3LWE3ZjQtM2ZiNDQ3OWJkMjM2XkEyXkFqcGc@._V1_Ratio0.6751_AL_.jpg",
    backdrop: "https://i.ytimg.com/vi/ISORfez27og/maxresdefault.jpg",
  },
};

export interface MovieMediaItem {
  id?: number;
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
}

export function getTMDBImageUrl(path?: string, size: "w500" | "w780" | "original" = "w500"): string {
  if (!path) {
    return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";
  }
  if (path.startsWith("http")) return path;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getMoviePosterUrl(movie?: MovieMediaItem | null): string {
  if (!movie) return getTMDBImageUrl(undefined, "w500");

  if (movie.id && MOVIE_IMAGE_OVERRIDES[movie.id]?.poster) {
    return MOVIE_IMAGE_OVERRIDES[movie.id].poster;
  }

  const titleKey = (movie.title || "").toLowerCase().trim();
  if (titleKey) {
    for (const [key, val] of Object.entries(MOVIE_IMAGE_OVERRIDES)) {
      if (typeof key === "string" && titleKey.includes(key)) {
        return val.poster;
      }
    }
  }

  return getTMDBImageUrl(movie.poster_path, "w500");
}

export function getMovieBackdropUrl(movie?: MovieMediaItem | null): string {
  if (!movie) return getTMDBImageUrl(undefined, "original");

  if (movie.id && MOVIE_IMAGE_OVERRIDES[movie.id]?.backdrop) {
    return MOVIE_IMAGE_OVERRIDES[movie.id].backdrop;
  }

  const titleKey = (movie.title || "").toLowerCase().trim();
  if (titleKey) {
    for (const [key, val] of Object.entries(MOVIE_IMAGE_OVERRIDES)) {
      if (typeof key === "string" && titleKey.includes(key)) {
        return val.backdrop;
      }
    }
  }

  return getTMDBImageUrl(movie.backdrop_path || movie.poster_path, "original");
}

