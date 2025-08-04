import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
};

function MoviePage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"movie" | "tv" | "all">("all");
  const [error, setError] = useState("");
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [upcomingTVShows, setUpcomingTVShows] = useState<TVShow[]>([]);
  const [searchResults, setSearchResults] = useState<(Movie | TVShow)[]>([]);
  const [loading, setLoading] = useState({
    topRated: false,
    upcoming: false,
    search: false,
  });

  const [topRatedMoviesSlide, setTopRatedMoviesSlide] = useState(0);
  const [topRatedTVShowsSlide, setTopRatedTVShowsSlide] = useState(0);
  const [upcomingMoviesSlide, setUpcomingMoviesSlide] = useState(0);
  const [upcomingTVShowsSlide, setUpcomingTVShowsSlide] = useState(0);

  const MOVIES_PER_SLIDE = 4;

  const fetchData = async (
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>,
    key: string
  ) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const result = await axios.get(endpoint);
      setState(result.data.results);
      console.log(`${key} Data:`, result.data.results);
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
      fetchData(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        setTopRatedMovies,
        "topRated"
      ),
      fetchData(
        `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        setTopRatedTVShows,
        "topRated"
      ),
    ]);
  };

  const fetchUpcoming = () => {
    setLoading({ ...loading, upcoming: true });
    Promise.all([
      fetchData(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        setUpcomingMovies,
        "upcoming"
      ),
      fetchData(
        `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        setUpcomingTVShows,
        "upcoming"
      ),
    ]);
  };

  useEffect(() => {
    fetchTopRated();
    fetchUpcoming();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setLoading({ ...loading, search: true });
    setError("");

    try {
      let endpoint = "";
      if (selectedCategory === "all") {
        endpoint = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}`;
      } else if (selectedCategory === "movie") {
        endpoint = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}`;
      } else {
        endpoint = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}`;
      }

      const response = await axios.get(endpoint);
      setSearchResults(response.data.results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    } finally {
      setLoading({ ...loading, search: false });
    }
  };

  const getCarouselItems = (items: any[], slideIndex: number) => {
    return items.slice(
      slideIndex * MOVIES_PER_SLIDE,
      (slideIndex + 1) * MOVIES_PER_SLIDE
    );
  };

  const renderMovieList = (movies: Movie[], slideIndex: number) => (
    <div className="flex overflow-x-auto space-x-6">
      {getCarouselItems(movies, slideIndex).map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          state={{ movieData: movie }} 
          key={movie.id}
        >
          <div className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-2xl transition-all duration-300 ease-in-out w-72 h-120">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-80 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="bg-gray-300 h-80 flex items-center justify-center rounded-lg mb-4">
                No Image
              </div>
            )}
            <h3 className="font-semibold text-lg mt-2 text-gray-800 truncate">
              {movie.title}
            </h3>
            <p className="font-semibold text-lg mt-2 text-gray-800 truncate">
              Time Released: {movie.release_date}
            </p>
            <div className="flex justify-center items-center mt-2">
              <div className="text-sm text-yellow-500 font-semibold">
                Rating:{" "}
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderTVShowList = (tvShows: TVShow[], slideIndex: number) => (
    <div className="flex overflow-x-auto space-x-6">
      {getCarouselItems(tvShows, slideIndex).map((tvShow) => (
        <Link
          to={`/tv/${tvShow.id}`}
          state={{ tvShowData: tvShow }} 
          key={tvShow.id}
        >
          <div className="bg-white rounded-lg shadow-lg p-4 text-center hover:shadow-2xl transition-all duration-300 ease-in-out w-72 h-120">
            {tvShow.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
                className="w-full h-80 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="bg-gray-300 h-80 flex items-center justify-center rounded-lg mb-4">
                No Image
              </div>
            )}
            <h3 className="font-semibold text-lg mt-2 text-gray-800 truncate">
              {tvShow.name}
            </h3>
            <p className="font-semibold text-lg mt-2 text-gray-800 truncate">
              Time Released: {tvShow.first_air_date}
            </p>
            <div className="flex justify-center items-center mt-2">
              <div className="text-sm text-yellow-500 font-semibold">
                Rating:{" "}
                {tvShow.vote_average ? tvShow.vote_average.toFixed(1) : "N/A"}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderSearchResults = () => {
    if (loading.search)
      return <div className="text-center py-8">Searching...</div>;
    if (error)
      return <div className="text-red-500 text-center py-4">{error}</div>;
    if (!searchResults.length)
      return <div className="text-center py-8">No results found</div>;

    return (
      <section className="w-full max-w-6xl mb-12">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Search Results
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((item) => (
            <Link
              to={`/${"title" in item ? "movie" : "tv"}/${item.id}`}
              state={{ itemData: item }}
              key={item.id}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 ease-in-out">
                {item.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={"title" in item ? item.title : item.name}
                    className="w-full h-96 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="bg-gray-300 h-96 flex items-center justify-center rounded-lg mb-4">
                    No Image
                  </div>
                )}
                <h3 className="font-semibold text-lg mt-2 text-gray-800 truncate">
                  {"title" in item ? item.title : item.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {"release_date" in item
                    ? item.release_date
                    : item.first_air_date}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const handleSlideChange = (direction: "prev" | "next", type: string) => {
    const totalSlides =
      type === "topRatedMovies"
        ? Math.ceil(topRatedMovies.length / MOVIES_PER_SLIDE)
        : type === "topRatedTVShows"
        ? Math.ceil(topRatedTVShows.length / MOVIES_PER_SLIDE)
        : type === "upcomingMovies"
        ? Math.ceil(upcomingMovies.length / MOVIES_PER_SLIDE)
        : Math.ceil(upcomingTVShows.length / MOVIES_PER_SLIDE);

    if (direction === "prev") {
      if (type === "topRatedMovies") {
        setTopRatedMoviesSlide((prev) => Math.max(prev - 1, 0));
      } else if (type === "topRatedTVShows") {
        setTopRatedTVShowsSlide((prev) => Math.max(prev - 1, 0));
      } else if (type === "upcomingMovies") {
        setUpcomingMoviesSlide((prev) => Math.max(prev - 1, 0));
      } else if (type === "upcomingTVShows") {
        setUpcomingTVShowsSlide((prev) => Math.max(prev - 1, 0));
      }
    } else {
      if (type === "topRatedMovies") {
        setTopRatedMoviesSlide((prev) =>
          Math.min(prev + 1, totalSlides - 1)
        );
      } else if (type === "topRatedTVShows") {
        setTopRatedTVShowsSlide((prev) =>
          Math.min(prev + 1, totalSlides - 1)
        );
      } else if (type === "upcomingMovies") {
        setUpcomingMoviesSlide((prev) =>
          Math.min(prev + 1, totalSlides - 1)
        );
      } else if (type === "upcomingTVShows") {
        setUpcomingTVShowsSlide((prev) =>
          Math.min(prev + 1, totalSlides - 1)
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <Navbar />
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search for Movies or TV Shows"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="w-full p-4 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        <button
          onClick={handleSearch}
          className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Search
        </button>
      </div>

      <div className="flex gap-6 mb-8 justify-center">
        <div
          onClick={() => setSelectedCategory("all")}
          className={`px-6 py-3 rounded-lg text-lg ${
            selectedCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-300"
          } cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
          All
        </div>

        <div
          onClick={() => setSelectedCategory("movie")}
          className={`px-6 py-3 rounded-lg text-lg ${
            selectedCategory === "movie" ? "bg-blue-600 text-white" : "bg-gray-300"
          } cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
          Movies
        </div>
        <div
          onClick={() => setSelectedCategory("tv")}
          className={`px-6 py-3 rounded-lg text-lg ${
            selectedCategory === "tv" ? "bg-blue-600 text-white" : "bg-gray-300"
          } cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
          TV Shows
        </div>
      </div>

      {query && renderSearchResults()}

      {!query && (
        <>
          {selectedCategory === "movie" || selectedCategory === "all" ? (
            <section className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">
                Top Rated Movies
              </h2>
              {renderMovieList(topRatedMovies, topRatedMoviesSlide)}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleSlideChange("prev", "topRatedMovies")}
                  disabled={topRatedMoviesSlide === 0}
                  className="text-xl text-blue-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleSlideChange("next", "topRatedMovies")}
                  disabled={
                    topRatedMoviesSlide >=
                    Math.ceil(topRatedMovies.length / MOVIES_PER_SLIDE) - 1
                  }
                  className="text-xl text-blue-800"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>
          ) : null}

          {selectedCategory === "tv" || selectedCategory === "all" ? (
            <section className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">
                Top Rated TV Shows
              </h2>
              {renderTVShowList(topRatedTVShows, topRatedTVShowsSlide)}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleSlideChange("prev", "topRatedTVShows")}
                  disabled={topRatedTVShowsSlide === 0}
                  className="text-xl text-blue-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleSlideChange("next", "topRatedTVShows")}
                  disabled={
                    topRatedTVShowsSlide >=
                    Math.ceil(topRatedTVShows.length / MOVIES_PER_SLIDE) - 1
                  }
                  className="text-xl text-blue-800"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>
          ) : null}

          {selectedCategory === "movie" || selectedCategory === "all" ? (
            <section className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">
                Upcoming Movies
              </h2>
              {renderMovieList(upcomingMovies, upcomingMoviesSlide)}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleSlideChange("prev", "upcomingMovies")}
                  disabled={upcomingMoviesSlide === 0}
                  className="text-xl text-blue-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleSlideChange("next", "upcomingMovies")}
                  disabled={
                    upcomingMoviesSlide >=
                    Math.ceil(upcomingMovies.length / MOVIES_PER_SLIDE) - 1
                  }
                  className="text-xl text-blue-800"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>
          ) : null}

          {selectedCategory === "tv" || selectedCategory === "all" ? (
            <section className="w-full max-w-6xl mb-12">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">
                Upcoming TV Shows
              </h2>
              {renderTVShowList(upcomingTVShows, upcomingTVShowsSlide)}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleSlideChange("prev", "upcomingTVShows")}
                  disabled={upcomingTVShowsSlide === 0}
                  className="text-xl text-blue-800"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => handleSlideChange("next", "upcomingTVShows")}
                  disabled={
                    upcomingTVShowsSlide >=
                    Math.ceil(upcomingTVShows.length / MOVIES_PER_SLIDE) - 1
                  }
                  className="text-xl text-blue-800"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}

export default MoviePage;
