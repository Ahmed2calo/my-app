import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type MovieDetailsType = {
  title: string;
  poster_path: string | null;
  overview: string;
};

type CastType = {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
};

type ReviewType = {
  id: string;
  author: string;
  content: string;
};

type RecommendationType = {
  id: number;
  title: string;
  poster_path: string | null;
};

function ReviewCard({ review }: { review: ReviewType }) {
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 250;
  const shouldTruncate = review.content.length > MAX_LENGTH;

  const displayText = expanded
    ? review.content
    : review.content.slice(0, MAX_LENGTH) + (shouldTruncate ? "..." : "");

  return (
    <div className="bg-gray-900/80 p-4 rounded-md shadow-md text-gray-100">
      <p className="text-sm text-gray-300 mb-1">By {review.author}</p>
      <p className="text-sm whitespace-pre-wrap">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-400 hover:text-blue-600 mt-2 text-sm font-medium"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const [movieRes, videosRes, creditsRes, reviewsRes, recRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`),
        ]);

        setMovie(movieRes.data);

        const trailer = videosRes.data.results.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);

        setCast(creditsRes.data.cast.slice(0, 10));
        setReviews(reviewsRes.data.results);
        setRecommendations(recRes.data.results.slice(0, 8));
      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-white">Loading...</p>;
  if (!movie) return <p className="text-center mt-10 text-white">Movie not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      {movie.poster_path ? (
        <img
          src={`${IMAGE_URL}${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-96 rounded-lg shadow mx-auto mb-4"
        />
      ) : (
        <div className="w-full md:w-96 h-96 bg-gray-700 flex items-center justify-center rounded-lg shadow mx-auto mb-4 text-gray-400">
          No Image Available
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-center">{movie.title}</h1>

      <p className="bg-gray-900/80 p-4 rounded-md text-gray-100 font-semibold text-lg mb-8 max-w-3xl mx-auto text-center">
        {movie.overview}
      </p>

      {/* Trailer */}
      {trailerKey && (
        <div className="mb-10 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">🎬 Trailer</h2>
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Movie Trailer"
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="mb-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">👥 Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cast.map((actor) => (
            <Link
              to={`/actor/${actor.id}`}
              key={actor.id}
              className="block bg-gray-800 rounded-lg shadow overflow-hidden text-center hover:scale-105 transition-transform"
            >
              {actor.profile_path ? (
                <img
                  src={`${IMAGE_URL}${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="bg-gray-700 h-48 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="p-2">
                <p className="text-sm font-bold truncate">{actor.name}</p>
                <p className="text-xs text-gray-400 truncate">as {actor.character}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

     
      <div className="mb-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">🎥 Recommendations</h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-400">No recommendations available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                to={`/movie/${rec.id}`}
                className="block bg-gray-800 rounded-lg shadow overflow-hidden text-center hover:scale-105 transition-transform"
              >
                {rec.poster_path ? (
                  <img
                    src={`${IMAGE_URL}${rec.poster_path}`}
                    alt={rec.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="bg-gray-700 h-48 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-2">
                  <p className="text-sm font-semibold truncate">{rec.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mb-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-white">📝 Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews available.</p>
        ) : (
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
