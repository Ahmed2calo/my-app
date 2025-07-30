import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

type MovieCarouselProps = {
  movies: Movie[];
  title: string;
};

function MovieCarousel({ movies, title }: MovieCarouselProps) {
  const [scrollIndex, setScrollIndex] = useState(0);
  const moviesPerScroll = 4;
  const maxScrollIndex = Math.max(movies.length - moviesPerScroll, 0);

  const scrollNext = () => {
    setScrollIndex((prev) => Math.min(prev + 1, maxScrollIndex));
  };

  const scrollPrev = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="w-full max-w-6xl mx-auto mb-8 px-4 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

      <div className="relative group">
        {scrollIndex > 0 && (
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10 opacity-70 group-hover:opacity-100 transition-opacity"
            aria-label="Previous movies"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{
              transform: `translateX(-${scrollIndex * (100 / moviesPerScroll)}%)`,
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-1/4 px-2"
              >
                <Link
                  to={`/movie/${movie.id}`}
                  className="block hover:scale-[1.05] transition-transform duration-200"
                >
                  <div className="bg-white rounded-md shadow-sm overflow-hidden hover:shadow-lg transform hover:scale-105 transition-transform">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-auto aspect-[2/3] object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 aspect-[2/3] flex items-center justify-center rounded-md">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                    <div className="p-2">
                      <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {movie.release_date?.substring(0, 4) || "N/A"}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {scrollIndex < maxScrollIndex && (
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10 opacity-70 group-hover:opacity-100 transition-opacity"
            aria-label="Next movies"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
}

export default MovieCarousel;
