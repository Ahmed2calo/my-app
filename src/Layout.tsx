import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 text-white">
      <Navbar />
      <SearchBar />
      
      <div className="px-6 py-4">
        <Outlet />
      
      </div>
      
    </div>
  );
}

export default Layout;
