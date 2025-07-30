import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <nav className="bg-teal-600 p-4 shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button
          onClick={handleGoHome}
          className="text-3xl font-extrabold text-white hover:text-teal-300 transition-all transform hover:scale-110"
        >
          🎬 Movie App
        </button>

        <div className="hidden md:flex space-x-6">
          <button
            onClick={handleGoHome}
            className="text-white text-lg font-semibold hover:text-teal-300 transition-all transform hover:scale-110"
          >
            Home
          </button>
        </div>

        <div className="md:hidden">
          <button
            className="text-white text-2xl hover:text-teal-300 transition-all"
            onClick={handleGoHome}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
