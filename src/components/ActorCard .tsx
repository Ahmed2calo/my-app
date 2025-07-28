import { Link } from 'react-router-dom';

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
}

function ActorCard({ actor }: { actor: Actor }) {
  return (
    <Link 
      to={`/actor/${actor.id}`} 
      className="block hover:scale-105 transition duration-300"
    >
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <img 
          src={actor.profile_path 
            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
            : '/placeholder-actor.jpg'}
          alt={actor.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-actor.jpg';
          }}
        />
        <div className="p-3">
          <h3 className="text-lg font-semibold truncate">{actor.name}</h3>
          {actor.character && (
            <p className="text-gray-400 text-sm truncate">
              as {actor.character}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ActorCard;