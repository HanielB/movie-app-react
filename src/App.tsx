import React, { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Catalog } from "./components/Catalog/Catalog";
import { Movie, getFavorites } from "./services/movies.service";
import { MoviesContext } from "./services/context";

function App() {
  useEffect(() => {
    // discoverMovies()
    getFavorites()
      .then(setMovies)
      .catch((_) => setMovies([]));
  }, []);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
      <MoviesContext.Provider value={{ movies, updateMovies: setMovies, loading, setLoading: setLoading }}>
      <div className="App">
        <Header></Header>
        <Catalog></Catalog>
      </div>
    </MoviesContext.Provider>
  );
}

export default App;
