import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type MediaDetails = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
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
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type?: 'movie' | 'tv';
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
  const location = useLocation();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [cast, setCast] = useState<CastType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setError(null);

      try {
        let type: 'movie' | 'tv' = 'movie';
        
        if (location.state?.mediaType) {
          type = location.state.mediaType;
        } else if (location.state?.tvShowData) {
          type = 'tv';
        } else if (location.pathname.includes('/tv/')) {
          type = 'tv';
        } else if (media?.media_type) {
          type = media.media_type;
        }

        setMediaType(type);

        const [detailsRes, videosRes, creditsRes, reviewsRes, recRes] = await Promise.all([
          axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}`)
        ]);

        const mergedData = location.state?.movieData || location.state?.tvShowData 
          ? { 
              ...(location.state.movieData || location.state.tvShowData),
              ...detailsRes.data,
              media_type: type
            }
          : {
              ...detailsRes.data,
              media_type: type
            };

        setMedia(mergedData);

        const trailer = videosRes.data.results.find(
          (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);

        setCast(creditsRes.data.cast.slice(0, 10));
        setReviews(reviewsRes.data.results);
        setRecommendations(
          recRes.data.results.slice(0, 8).map((item: any) => ({
            ...item,
            media_type: type 
          }))
        );
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchDetails();
    }
  }, [id, location.state, location.pathname]);

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!media) return <div className="text-center mt-10 text-white">Details not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
    
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {media.poster_path ? (
          <img
            src={`${IMAGE_URL}${media.poster_path}`}
            alt={media.title || media.name || "Media poster"}
            className="w-full md:w-96 rounded-lg shadow"
          />
        ) : (
          <div className="w-full md:w-96 h-96 bg-gray-700 flex items-center justify-center rounded-lg shadow text-gray-400">
            No Image Available
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{media.title || media.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            {media.vote_average && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                {media.vote_average.toFixed(1)}/10
              </span>
            )}
            <span>
              {media.release_date || media.first_air_date}
            </span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
              {mediaType === 'movie' ? 'Movie' : 'TV Show'}
            </span>
          </div>

          <p className="bg-gray-900/80 p-4 rounded-md text-gray-100 mb-6">
            {media.overview}
          </p>
        </div>
      </div>

      {trailerKey && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">🎬 Trailer</h2>
          <div className="relative" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🎭 Cast</h2>
        {cast.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {cast.map((actor) => (
              <Link to={`/actor/${actor.id}`} key={actor.id}>
                <div className="text-center">
                  {actor.profile_path ? (
                    <img
                      src={`${IMAGE_URL}${actor.profile_path}`}
                      alt={actor.name}
                      className="w-32 h-48 object-cover mx-auto rounded-md"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-700 flex items-center justify-center rounded-md mx-auto">
                      <span className="text-xs">No Photo</span>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-300">{actor.name}</p>
                  <p className="text-sm text-gray-500">{actor.character}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No cast information available.</p>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🎬 Recommendations</h2>
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <Link 
                to={`/${rec.media_type || (rec.title ? 'movie' : 'tv')}/${rec.id}`}
                state={{ 
                  [rec.media_type === 'movie' || rec.title ? 'movieData' : 'tvShowData']: rec,
                  mediaType: rec.media_type || (rec.title ? 'movie' : 'tv')
                }}
                key={rec.id}
              >
                <div className="text-center">
                  {rec.poster_path ? (
                    <img
                      src={`${IMAGE_URL}${rec.poster_path}`}
                      alt={rec.title || rec.name || "Recommendation poster"}
                      className="w-32 h-48 object-cover mx-auto rounded-md"
                    />
                  ) : (
                    <div className="w-32 h-48 bg-gray-700 flex items-center justify-center rounded-md mx-auto">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  <p className="mt-2 text-sm text-gray-300">{rec.title || rec.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recommendations available.</p>
        )}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">📝 Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No reviews available.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;