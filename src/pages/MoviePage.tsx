import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
};

function MoviePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"movie" | "tv" | "all">("all");
  const [error, setError] = useState("");
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [upcomingTVShows, setUpcomingTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState({ topRated: false, upcoming: false, search: false });
  const [topRatedMoviesSlide, setTopRatedMoviesSlide] = useState(0);
  const [topRatedTVShowsSlide, setTopRatedTVShowsSlide] = useState(0);
  const [upcomingMoviesSlide, setUpcomingMoviesSlide] = useState(0);
  const [upcomingTVShowsSlide, setUpcomingTVShowsSlide] = useState(0);

  const MOVIES_PER_SLIDE = 4; // 4 items per slide




  // Reusable function to fetch data
  const fetchData = async (endpoint: string, setState: React.Dispatch<React.SetStateAction<any[]>>, key: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const result = await axios.get(endpoint);
      setState(result.data.results);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch ${key}.`);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const fetchTopRated = () => {
    setLoading({ ...loading, topRated: true });
    Promise.all([
      fetchData(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`, setTopRatedMovies, "topRated"),
      fetchData(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`, setTopRatedTVShows, "topRated"),
    ]);
  };

  const fetchUpcoming = () => {
    setLoading({ ...loading, upcoming: true });
    Promise.all([
      fetchData(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`, setUpcomingMovies, "upcoming"),
      fetchData(`${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`, setUpcomingTVShows, "upcoming"),
    ]);
  };

  useEffect(() => {
    fetchTopRated();
    fetchUpcoming();
  }, []);

  // Helper function to slice the list for carousel navigation
  const getCarouselItems = (items: any[], slideIndex: number) => {
    return items.slice(slideIndex * MOVIES_PER_SLIDE, (slideIndex + 1) * MOVIES_PER_SLIDE);
  };





  const renderMovieList = (movies: Movie[], slideIndex: number) => (
    <div className="flex overflow-x-auto space-x-6">
      {getCarouselItems(movies, slideIndex).map((movie) => (
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
      ))}
    </div>
  );





  const renderTVShowList = (tvShows: TVShow[], slideIndex: number) => (
    <div className="flex overflow-x-auto space-x-6">
      {getCarouselItems(tvShows, slideIndex).map((tvShow) => (
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
      ))}
    </div>
  );

  const handleSearch = () => {
    // Handle the search query
    console.log(query);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center p-6">
      <Navbar />

      {/* Search Bar Section */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search for Movies or TV Shows"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="w-full mt-2 bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          Search
        </button>
      </div>

      {/* Category Buttons Section */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedCategory("movie")}
          className={`px-4 py-2 rounded ${selectedCategory === "movie" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          Movies
        </button>
        <button
          onClick={() => setSelectedCategory("tv")}
          className={`px-4 py-2 rounded ${selectedCategory === "tv" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          TV Shows
        </button>
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded ${selectedCategory === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
        >
          All
        </button>
      </div>

      {/* Display Movies or TV Shows based on the selected category */}
      {selectedCategory === "movie" || selectedCategory === "all" ? (
        <section className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Top Rated Movies</h2>
          {renderMovieList(topRatedMovies, topRatedMoviesSlide)}
          <div className="flex justify-between mt-4">
            <button onClick={() => setTopRatedMoviesSlide((prev) => Math.max(prev - 1, 0))} className="text-xl">
              ←
            </button>
            <button
              onClick={() => setTopRatedMoviesSlide((prev) => Math.min(prev + 1, Math.ceil(topRatedMovies.length / MOVIES_PER_SLIDE) - 1))}
              className="text-xl"
            >
              →
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-blue-800 mt-8">Upcoming Movies</h2>
          {renderMovieList(upcomingMovies, upcomingMoviesSlide)}
          <div className="flex justify-between mt-4">
            <button onClick={() => setUpcomingMoviesSlide((prev) => Math.max(prev - 1, 0))} className="text-xl">
              ←
            </button>
            <button
              onClick={() => setUpcomingMoviesSlide((prev) => Math.min(prev + 1, Math.ceil(upcomingMovies.length / MOVIES_PER_SLIDE) - 1))}
              className="text-xl"
            >
              →
            </button>
          </div>
        </section>
      ) : null}

      {selectedCategory === "tv" || selectedCategory === "all" ? (
        <section className="w-full max-w-6xl mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Top Rated TV Shows</h2>
          {renderTVShowList(topRatedTVShows, topRatedTVShowsSlide)}
          <div className="flex justify-between mt-4">
            <button onClick={() => setTopRatedTVShowsSlide((prev) => Math.max(prev - 1, 0))} className="text-xl">
              ←
            </button>
            <button
              onClick={() => setTopRatedTVShowsSlide((prev) => Math.min(prev + 1, Math.ceil(topRatedTVShows.length / MOVIES_PER_SLIDE) - 1))}
              className="text-xl"
            >
              →
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-blue-800 mt-8">Upcoming TV Shows</h2>
          {renderTVShowList(upcomingTVShows, upcomingTVShowsSlide)}
          <div className="flex justify-between mt-4">
            <button onClick={() => setUpcomingTVShowsSlide((prev) => Math.max(prev - 1, 0))} className="text-xl">
              ←
            </button>
            <button
              onClick={() => setUpcomingTVShowsSlide((prev) => Math.min(prev + 1, Math.ceil(upcomingTVShows.length / MOVIES_PER_SLIDE) - 1))}
              className="text-xl"
            >
              →
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default MoviePage;
