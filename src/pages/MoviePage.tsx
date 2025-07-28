import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel";
import Navbar from "../components/Navbar";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

function MoviePage() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fetchTopRated = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      setTopRatedMovies(result.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch top rated movies.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      setUpcomingMovies(result.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch upcoming movies.");
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    if (!query.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setIsSearching(true);

    try {
      const result = await axios.get(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );
      setSearchResults(result.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
  };

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
    setSearchResults([]);
    setError("");
  };

  useEffect(() => {
    fetchTopRated();
    fetchUpcoming();
  }, []);

  const renderMovieList = (movies: Movie[]) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {movies.map((movie) => (
      <Link to={`/movie/${movie.id}`} key={movie.id}>
        <div className="bg-white rounded shadow p-2 text-center hover:shadow-lg h-full flex flex-col">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-64 object-cover rounded"
            />
          ) : (
            <div className="bg-gray-300 h-64 flex items-center justify-center rounded">
              No Image
            </div>
          )}
          <h3 className="font-semibold text-sm mt-2 truncate">{movie.title}</h3>
          <p className="text-xs text-gray-600">{movie.release_date}</p>
        </div>
      </Link>
    ))}
  </div>
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center p-6">
      <Navbar />

      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
        🎬 Movie Search App
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-4"
      >
        <input
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 transition"
        >
          Search
        </button>
        {isSearching && (
          <button
            type="button"
            onClick={clearSearch}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg px-4 py-3 transition"
          >
            Clear
          </button>
        )}
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-blue-700 mb-4 animate-pulse">Loading...</p>}

      {isSearching ? (
        <section className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">
            Search Results for "{query}"
          </h2>
          {searchResults.length > 0 ? (
            renderMovieList(searchResults)
          ) : (
            <p>No results found.</p>
          )}
        </section>
      ) : (
        <>
          <section className="w-full max-w-6xl mb-12">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
            </h2>
            <MovieCarousel movies={topRatedMovies} title="Top Rated Movies" />
          </section>

          <section className="w-full max-w-6xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
            </h2>
            <MovieCarousel movies={upcomingMovies} title="Upcoming Movies" />
          </section>
        </>
      )}
    </div>
  );
}

export default MoviePage;
