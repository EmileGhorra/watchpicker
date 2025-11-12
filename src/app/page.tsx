"use client";

import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { Play, Share2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  buildWatchSearchUrl,
  fetchRandomMovie,
  fetchMovieById,
  buildTmdbMovieUrl,
  type MoviePick,
} from "@/lib/tmdb";

const truncate = (value: string, max = 220) =>
  value.length > max ? `${value.slice(0, max).trim()}…` : value;

const GENRE_OPTIONS = [
  { id: 28, label: "Action" },
  { id: 12, label: "Adventure" },
  { id: 35, label: "Comedy" },
  { id: 80, label: "Crime" },
  { id: 18, label: "Drama" },
  { id: 14, label: "Fantasy" },
  { id: 27, label: "Horror" },
  { id: 9648, label: "Mystery" },
  { id: 10749, label: "Romance" },
  { id: 878, label: "Sci-Fi" },
  { id: 53, label: "Thriller" },
];

export default function Home() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center text-gray-400">Loading WatchPicker…</div>}>
      <WatchPickerApp />
    </Suspense>
  );
}

function WatchPickerApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieIdParam = searchParams.get("movieId");
  const [maxRuntime, setMaxRuntime] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [minYear, setMinYear] = useState<string>("");
  const [maxYear, setMaxYear] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");
  const [maxRating, setMaxRating] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movie, setMovie] = useState<MoviePick | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const skipHydrateIdRef = useRef<number | null>(null);
  const loadedMovieIdRef = useRef<number | null>(null);
  const toggleGenre = (genreId: number) => {
    setSelectedGenres((current) =>
      current.includes(genreId)
        ? current.filter((id) => id !== genreId)
        : [...current, genreId],
    );
  };

  const updateMovieQueryParam = (movieId: number, skipHydrate = false) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("movieId", String(movieId));
    router.replace(`?${params.toString()}`, { scroll: false });
    if (skipHydrate) {
      skipHydrateIdRef.current = movieId;
      loadedMovieIdRef.current = movieId;
    }
  };

  useEffect(() => {
    if (!movieIdParam) return;

    const parsed = Number(movieIdParam);
    if (Number.isNaN(parsed)) {
      setError("Invalid movie link.");
      return;
    }

    if (skipHydrateIdRef.current === parsed) {
      skipHydrateIdRef.current = null;
      return;
    }

    if (loadedMovieIdRef.current === parsed) {
      return;
    }

    let ignore = false;
    setIsLoading(true);
    setError(null);

    fetchMovieById(parsed)
      .then((result) => {
        if (ignore) return;
        loadedMovieIdRef.current = result.id;
        setMovie(result);
      })
      .catch((err) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Unable to load shared movie.");
        setMovie(null);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [movieIdParam]);

  const handlePickMovie = async () => {
    const minYearValue = minYear ? Number(minYear) : undefined;
    const maxYearValue = maxYear ? Number(maxYear) : undefined;
    const minRatingValue = minRating ? Number(minRating) : undefined;
    const maxRatingValue = maxRating ? Number(maxRating) : undefined;

    if (
      minYearValue &&
      maxYearValue &&
      Number.isFinite(minYearValue) &&
      Number.isFinite(maxYearValue) &&
      minYearValue > maxYearValue
    ) {
      setError("Min release year must be before max release year.");
      return;
    }

    if (
      minRatingValue &&
      (!Number.isFinite(minRatingValue) || minRatingValue < 0 || minRatingValue > 10)
    ) {
      setError("Min rating must be between 0 and 10.");
      return;
    }

    if (
      maxRatingValue &&
      (!Number.isFinite(maxRatingValue) || maxRatingValue < 0 || maxRatingValue > 10)
    ) {
      setError("Max rating must be between 0 and 10.");
      return;
    }

    if (
      minRatingValue &&
      maxRatingValue &&
      Number.isFinite(minRatingValue) &&
      Number.isFinite(maxRatingValue) &&
      minRatingValue > maxRatingValue
    ) {
      setError("Min rating cannot exceed max rating.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShareFeedback(null);

    try {
      const result = await fetchRandomMovie({
        maxRuntime: maxRuntime ? Number(maxRuntime) : undefined,
        region: region ? region.toUpperCase() : undefined,
        minYear: minYearValue,
        maxYear: maxYearValue,
        minRating: minRatingValue,
        maxRating: maxRatingValue,
        genreIds: selectedGenres,
      });

      setMovie(result);
      updateMovieQueryParam(result.id, true);
    } catch (err) {
      setMovie(null);
      setError(
        err instanceof Error
          ? err.message
          : "We hit a snag fetching a new movie.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!movie) return;

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("movieId", String(movie.id));
    const shareUrl = currentUrl.toString();
    const shareText = `WatchPicker suggests "${movie.title}". Discover where to watch it: ${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl,
        });
        setShareFeedback("Shared!");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setShareFeedback("Copied link!");
    } catch {
      setShareFeedback("Unable to share right now.");
    } finally {
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-8 px-6 py-12 text-gray-100 sm:px-10 lg:px-0">
      <section className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-start">
          <Image
            src="/logo.png"
            alt="WatchPicker logo"
            width={72}
            height={72}
            className="drop-shadow-[0_10px_25px_rgba(252,165,165,0.35)]"
            priority
          />
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
              WatchPicker
            </p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Your next movie night, curated.
            </h1>
          </div>
        </div>
        <p className="text-base text-gray-300 sm:text-lg">
          Set a mood, hit &ldquo;Pick a Movie&rdquo;, and WatchPicker pulls a
          cinematic gem from TMDB&apos;s massive catalog.
        </p>
      </section>

      <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="runtime" className="text-xs uppercase text-gray-400">
              Max runtime (minutes)
            </label>
            <Input
              id="runtime"
              type="number"
              min={60}
              max={240}
              placeholder="120"
              value={maxRuntime}
              onChange={(event) => setMaxRuntime(event.target.value)}
              className="border-white/20 bg-black/50 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="region" className="text-xs uppercase text-gray-400">
              Region (2-letter code)
            </label>
            <Input
              id="region"
              maxLength={2}
              placeholder="US"
              value={region}
              onChange={(event) => setRegion(event.target.value.toUpperCase())}
              className="border-white/20 bg-black/50 uppercase text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase text-gray-400">TMDB rating (min / max)</label>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="Min 4.5"
                value={minRating}
                onChange={(event) => setMinRating(event.target.value)}
                className="border-white/20 bg-black/50 text-white placeholder:text-gray-500"
              />
              <Input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="Max 7.5"
                value={maxRating}
                onChange={(event) => setMaxRating(event.target.value)}
                className="border-white/20 bg-black/50 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase text-gray-400">Release year range</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="number"
              min={1950}
              max={2100}
              placeholder="From"
              value={minYear}
              onChange={(event) => setMinYear(event.target.value)}
              className="border-white/20 bg-black/50 text-white placeholder:text-gray-500"
            />
            <Input
              type="number"
              min={1950}
              max={2100}
              placeholder="To"
              value={maxYear}
              onChange={(event) => setMaxYear(event.target.value)}
              className="border-white/20 bg-black/50 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase text-gray-400">Genres</p>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <button
                  type="button"
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${isSelected
                      ? "border-rose-400 bg-rose-500/30 text-white"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                    }`}
                >
                  {genre.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase text-gray-500">
            Dial in your filters, then let WatchPicker hunt for you.
          </p>
          <Button
            onClick={handlePickMovie}
            disabled={isLoading}
            className="w-full gap-2 rounded-xl bg-rose-600 text-lg font-semibold hover:bg-rose-500 sm:w-auto"
          >
            {isLoading ? "Scanning…" : "Pick a Movie"}
            <Play className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <div className="w-full rounded-xl border border-white/10 bg-gray-900/60 p-4 text-center text-sm text-gray-400">
        <div className="w-full h-24 bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Ad placeholder
        </div>
      </div>

      {error && (
        <p className="text-center text-sm text-rose-300 sm:text-left">{error}</p>
      )}

      {movie && (
        <>
          <Card className="card-glow border-white/10 bg-gradient-to-br from-[#0f0f12]/90 via-[#12121b]/80 to-[#09090c]/95 text-white">
            <CardHeader className="flex flex-col gap-4 md:flex-row">
              <div className="relative mx-auto aspect-[2/3] w-48 overflow-hidden rounded-2xl border border-white/10 poster-hover md:mx-0 md:w-56">
                {movie.posterUrl ? (
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    sizes="224px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-b from-zinc-800 to-black text-sm text-gray-400">
                    Poster unavailable
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between space-y-4">
                <CardTitle className="text-3xl font-semibold">{movie.title}</CardTitle>
                <p className="text-base text-gray-200">
                  {truncate(movie.overview)}{" "}
                  <a
                    href={buildTmdbMovieUrl(movie.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-rose-300 underline-offset-4 hover:underline"
                  >
                    Read more
                  </a>
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  {movie.releaseDate && (
                    <span>Released {new Date(movie.releaseDate).getFullYear()}</span>
                  )}
                  {movie.voteAverage && (
                    <span>
                      TMDB Score {movie.voteAverage.toFixed(1)}
                      {movie.voteCount ? ` · ${movie.voteCount.toLocaleString()} votes` : ""}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                className="flex-1 min-w-0 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <a href={buildWatchSearchUrl(movie.title)} target="_blank" rel="noreferrer">
                  Where to watch
                </a>
              </Button>
              <Button
                type="button"
                onClick={handleShare}
                className="flex-1 min-w-0 gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {shareFeedback && (
                <span className="text-sm text-gray-400">{shareFeedback}</span>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {!movie && !error && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/40 p-6 text-center text-gray-400">
          Tap &ldquo;Pick a Movie&rdquo; to get a surprise straight from TMDB.
        </div>
      )}
    </main>
  );
}
