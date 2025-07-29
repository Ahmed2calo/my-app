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
          className="text-2xl font-bold text-white hover:text-teal-300 transition-all"
        >
          🎬 Movie App
        </button>

      
        <div className="space-x-4">
          <button
            onClick={handleGoHome}       
            className="text-white hover:text-teal-300 transition-all"
          >
            Home
          </button>

          <button
            onClick={() => navigate(-1)}  
            className="text-white hover:text-teal-300 transition-all"
          >
            🔙 Back
          </button>
        </div>
      </div>
    </nav>
  );
}
