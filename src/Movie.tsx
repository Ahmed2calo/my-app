import React, { useState } from "react";
import axios from "axios";

type MovieType = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
};

function Movie() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieType[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      .get(`https://www.omdbapi.com/?apikey=3b3a2649&s=${encodeURIComponent(query)}`)
      .then((response) => {
        if (response.data.Response === "True") {
          setMovies(response.data.Search);
        } else {
          setMovies(null);
          setError(response.data.Error || "Movie not found.");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Error fetching data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">🎬 Movie Search App</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
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
      {loading && <p className="mt-4 text-blue-700 animate-pulse">Loading...</p>}
      {movies && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 w-full max-w-6xl">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center text-center">
              {movie.Poster !== "N/A" ? (
                <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover rounded mb-4" />
              ) : (
                <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded mb-4">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <h2 className="text-lg font-semibold text-gray-800">{movie.Title}</h2>
              <p className="text-gray-600">{movie.Year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Movie; 