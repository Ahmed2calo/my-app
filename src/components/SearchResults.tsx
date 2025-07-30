import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  type: "movie";
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  type: "tv";
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<(Movie | TVShow)[]>([]); // Combined results (movies and TV shows)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(""); // Reset error on new search

      const fetchSearchResults = async () => {
        try {
          // Fetching movies and TV shows based on the query
          const movieEndpoint = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
          const tvShowEndpoint = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

          const [moviesResponse, tvShowsResponse] = await Promise.all([
            axios.get(movieEndpoint),
            axios.get(tvShowEndpoint),
          ]);

          // Combine both movie and TV show results
          const combinedResults = [
            ...moviesResponse.data.results.map((movie: Movie) => ({ ...movie, type: "movie" })),
            ...tvShowsResponse.data.results.map((tvShow: TVShow) => ({ ...tvShow, type: "tv" }))
          ];

          // Shuffle the results to display them randomly
          const shuffledResults = shuffleArray(combinedResults);
          setResults(shuffledResults);

        } catch (error) {
          console.error(error);
          setError("Failed to fetch search results.");
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [query]);

  // Helper function to shuffle an array randomly
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Render list of items (both movies and TV shows)
  const renderResults = () => {
    return results.map((item) => {
      if (item.type === "movie") {
        const movie = item as Movie;
        return (
          <Link to={`/movie/${movie.id}`} key={movie.id}>
            <div className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-xl h-full flex flex-col">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="bg-gray-300 h-96 flex items-center justify-center rounded-lg mb-4">
                  No Image
                </div>
              )}
              <h3 className="font-semibold text-lg mt-2 text-gray-800 truncate">{movie.title}</h3>
              <p className="text-sm text-gray-600">{movie.release_date}</p>
            </div>
          </Link>
        );
      } else {
        const tvShow = item as TVShow;
        return (
          <Link to={`/tv/${tvShow.id}`} key={tvShow.id}>
            <div className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-xl h-full flex flex-col">
              {tvShow.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                  alt={tvShow.name}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="bg-gray-300 h-96 flex items-center justify-center rounded-lg mb-4">
                  No Image
                </div>
              )}
              <h3 className="font-semibold text-lg mt-2 text-gray-800 truncate">{tvShow.name}</h3>
              <p className="text-sm text-gray-600">{tvShow.first_air_date}</p>
            </div>
          </Link>
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

      {/* Search Bar */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search for Movies or TV Shows"
          value={query || ""}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => window.location.href = `/search?q=${e.target.value}`}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-blue-700">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          {/* Display Results */}
          {results.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {renderResults()}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
