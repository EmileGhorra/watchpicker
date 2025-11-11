const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface TMDBMoviePayload {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
}

export interface MoviePick {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
}

export interface MovieFilters {
  maxRuntime?: number;
  region?: string;
  genreIds?: number[];
  minYear?: number;
  maxYear?: number;
  minRating?: number;
}

const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_TMDB_API_KEY");
  }
  return key;
};

const mapMovieToPick = (movie: TMDBMoviePayload): MoviePick => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  posterUrl: buildPosterUrl(movie.poster_path),
  releaseDate: movie.release_date,
  voteAverage: movie.vote_average,
  voteCount: movie.vote_count,
});

export const buildWatchSearchUrl = (title: string) =>
  `https://www.google.com/search?q=${encodeURIComponent(
    `where to watch ${title}`,
  )}`;

export const buildPosterUrl = (posterPath?: string | null) =>
  posterPath ? `${TMDB_IMAGE_BASE}${posterPath}` : null;

export const buildTmdbMovieUrl = (id: number) =>
  `https://www.themoviedb.org/movie/${id}`;

export async function fetchRandomMovie(filters: MovieFilters = {}) {
  const apiKey = getApiKey();
  const params = new URLSearchParams({
    api_key: apiKey,
    sort_by: "popularity.desc",
    "vote_count.gte": "300",
    include_adult: "false",
    language: "en-US",
    page: String(Math.floor(Math.random() * 10) + 1),
  });

  if (filters.maxRuntime && Number.isFinite(filters.maxRuntime)) {
    params.set("with_runtime.lte", String(filters.maxRuntime));
  }

  if (filters.region) {
    params.set("watch_region", filters.region.toUpperCase());
  }

  if (filters.genreIds?.length) {
    params.set("with_genres", filters.genreIds.join(","));
  }

  if (filters.minYear && Number.isFinite(filters.minYear)) {
    params.set("primary_release_date.gte", `${Math.floor(filters.minYear)}-01-01`);
  }

  if (filters.maxYear && Number.isFinite(filters.maxYear)) {
    params.set("primary_release_date.lte", `${Math.floor(filters.maxYear)}-12-31`);
  }

  if (filters.minRating && Number.isFinite(filters.minRating)) {
    params.set("vote_average.gte", filters.minRating.toFixed(1));
  }

  const response = await fetch(`${TMDB_API_BASE}/discover/movie?${params}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Unable to load movies right now.");
  }

  const data = (await response.json()) as { results?: TMDBMoviePayload[] };
  const results = data.results?.filter((movie) => movie.overview?.trim()) ?? [];

  if (!results.length) {
    throw new Error("No movies found with the current filters.");
  }

  const pick = results[Math.floor(Math.random() * results.length)];
  return mapMovieToPick(pick);
}

export async function fetchMovieById(id: number) {
  const apiKey = getApiKey();
  const response = await fetch(`${TMDB_API_BASE}/movie/${id}?api_key=${apiKey}`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Unable to load that movie.");
  }

  const movie = (await response.json()) as TMDBMoviePayload;
  if (!movie.overview?.trim()) {
    throw new Error("Movie details are incomplete.");
  }

  return mapMovieToPick(movie);
}
