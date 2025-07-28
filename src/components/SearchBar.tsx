export default function SearchBar() {
  return (
    <div className="bg-gray-800 p-4 shadow-md rounded-lg mt-16 mb-6 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search movies or actors..."
        className="w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
}
