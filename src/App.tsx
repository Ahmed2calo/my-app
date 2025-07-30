import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import MoviePage from "./pages/MoviePage";
import MovieDetails from "./components/MovieDetails";
import ActorDetailsPage from "./pages/ActorDetailPage";
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MoviePage />} />
          
          <Route path="movie/:id" element={<MovieDetails  />} />
          <Route path="tv/:id" element={<MovieDetails />} />
          
          <Route path="actor/:id" element={<ActorDetailsPage />} />
          
          <Route path="search" element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
