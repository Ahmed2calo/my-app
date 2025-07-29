import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h1>
    </div>
  );
};

export default SearchResults;