import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";  // Layout component with Navbar and SearchBar
import MoviePage from "./pages/MoviePage";  // Home Page
import MovieDetails from "./components/MovieDetails";  // Movie Details Page
import ActorDetailsPage from "./pages/ActorDetailPage ";  // Actor Details Page
import SearchResults from "./components/SearchResults";  // Search Results Page

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout component wraps the Navbar and SearchBar */}
        <Route path="/" element={<Layout />}>
          {/* Home Page (MoviePage) */}
          <Route index element={<MoviePage />} />

          {/* Other routes */}
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="actor/:id" element={<ActorDetailsPage />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
