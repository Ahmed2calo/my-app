import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar and Search Bar */}
      <Navbar />
      <SearchBar />
      
      {/* Outlet renders the nested pages (MovieDetails, ActorDetails, etc.) */}
      <div className="px-6 py-4">
        <Outlet />
      </div>
    </div>
  );
}
