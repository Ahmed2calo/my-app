import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-teal-600 p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <Link to="/" className="text-2xl font-bold text-white hover:text-teal-300 transition-all">
          🎬 Movie App
        </Link>

        {/* Navigation Links */}
        <div className="space-x-4">
          {/* Home Link */}
          <Link to="/" className="text-white hover:text-teal-300 transition-all">Home</Link>

         
        </div>
      </div>
    </nav>
  );
}
