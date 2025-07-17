import React, { useState } from "react";
import axios from "axios";

type MovieType = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
  Plot?: string;
  Awards?: string;
};

function Movie() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieType[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // ✅ filter state

  // Use environment variable here
  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a movie name.");
      return;
    }
    fetchMovies();
  };

  const fetchMovies = () => {
    setLoading(true);
    setError("");

    axios
      .get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
          query.trim()
        )}${filterType !== "all" ? `&type=${filterType}` : ""}`
      )
      .then((response) => {
        if (response.data.Response === "True") {
          const searchResults = response.data.Search;

          Promise.all(
            searchResults.map((movie: MovieType) =>
              axios
                .get(
                  `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`
                )
                .then((detailResponse) => {
                  if (detailResponse.data.Response === "True") {
                    return {
                      ...movie,
                      Plot: detailResponse.data.Plot,
                      Awards: detailResponse.data.Awards,
                    };
                  }
                  return movie; // fallback if details not found
                })
                .catch((error) => {
                  console.error(
                    `Error fetching details for ${movie.Title}`,
                    error
                  );
                  return movie; // fallback if error occurs
                })
            )
          )
            .then((detailedMovies) => {
              setMovies(detailedMovies);
            })
            .catch((error) => {
              console.error("Error fetching detailed movie data", error);
              setError("Error fetching movie details. Please try again.");
              setMovies(searchResults); // fallback to basic search results
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setMovies(null);
          setError(response.data.Error || "Movie not found.");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">
        🎬 Movie Search App
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        {/* ✅ Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
        </select>

        <input
          type="text"
          placeholder="Enter movie name..."
          value={query}
          onChange={handleChange}
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-4 py-3 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}
      {loading && (
        <p className="mt-4 text-blue-700 animate-pulse">Loading...</p>
      )}

      {movies && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 w-full max-w-6xl">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center"
            >
              {movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-64 object-cover rounded mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {movie.Title}
              </h2>
              <p className="text-gray-600">{movie.Year}</p>
              <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                {movie.Plot && movie.Plot !== "N/A"
                  ? movie.Plot
                  : "No description available."}
              </p>
              {movie.Awards && movie.Awards !== "N/A" && (
                <p className="text-green-600 text-xs mt-1">{movie.Awards}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movie;
