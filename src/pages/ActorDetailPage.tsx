import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

type Actor = {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string | null;
};

type MovieCredit = {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
};

export default function ActorDetailsPage() {
  const { id } = useParams();
  const actorId = id ? Number(id) : null;
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actorId) return;

    const fetchActorDetails = async () => {
      setLoading(true);
      try {
        const [actorRes, creditsRes] = await Promise.all([
          axios.get(`${BASE_URL}/person/${actorId}?api_key=${API_KEY}`),
          axios.get(`${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`),
        ]);

        setActor(actorRes.data);
        setMovies(creditsRes.data.cast || []);
      } catch (error) {
        console.error("❌ Failed to fetch actor:", error.response || error.message || error);
        setActor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [actorId]);

  if (loading) {
    return <div className="text-white text-center py-10">Loading actor details...</div>;
  }

  if (!actor) {
    return <div className="text-white text-center py-10">Actor not found.</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto text-white">
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3">
          {actor.profile_path ? (
            <img
              src={`${IMAGE_URL}${actor.profile_path}`}
              alt={actor.name}
              className="rounded-lg shadow-md w-full"
            />
          ) : (
            <div className="bg-gray-700 aspect-[2/3] flex items-center justify-center text-gray-400 rounded-lg">
              No image available
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
          {actor.birthday && (
            <p className="text-gray-300 mb-1">
              <strong>Born:</strong> {actor.birthday}
              {actor.place_of_birth && ` in ${actor.place_of_birth}`}
            </p>
          )}
          {actor.deathday && (
            <p className="text-gray-300 mb-3">
              <strong>Died:</strong> {actor.deathday}
            </p>
          )}
          {actor.biography ? (
            <div className="bg-gray-900/80 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Biography</h2>
              <p className="text-gray-200 whitespace-pre-line">{actor.biography}</p>
            </div>
          ) : (
            <p className="text-gray-400">No biography available.</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">🎬 Known For</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="block bg-gray-800 rounded-lg shadow overflow-hidden text-center hover:scale-105 transition-transform"
            >
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="bg-gray-700 aspect-[2/3] flex items-center justify-center text-gray-400">
                  No Poster
                </div>
              )}
              <div className="p-2">
                <p className="text-sm font-bold truncate">{movie.title}</p>
                {movie.character && (
                  <p className="text-xs text-gray-400 truncate">as {movie.character}</p>
                )}
                {movie.release_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
