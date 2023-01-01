import React, { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header/Header";
import { Catalog } from "./components/Catalog/Catalog";
import { Movie } from "./services/movies.service";
import { MoviesContext } from "./services/context";

function App() {

  const url = new URL(window.location.href);

  useEffect(() => {
    const list = url.searchParams.get("list");
    var init = "favorites.json";
    console.log("Init is", init)
    if (list)
    {
      init = list + ".json";
      console.log("Set init to", init)
    }
    fetch(init,
          { method: 'get',
            headers: {
              'content-type': 'text/csv;charset=UTF-8',
            }})
      .then((res) => res.json())
      .then((loadedMovies) => setMovies(loadedMovies));
  }, []);

  useEffect(() => {
    const src = url.searchParams.get("src");
    var init = "master.json";
    console.log("Src is", init)
    if (src)
    {
      console.log("Set src to", src)
      init = src;
    }
    fetch(init,
          { method: 'get',
            headers: {
              'content-type': 'text/csv;charset=UTF-8',
            }})
      .then((res) => res.json())
      .then((loadedSrc) => setMaster(loadedSrc));
  }, []);

  const [movies, _setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [master, setMaster] = useState<Object[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const setMovies = (movies) => {
    _setMovies([]);
    _setMovies(movies);
  };

  return (
    <MoviesContext.Provider value={
                              {master, movies, selected, updateMovies: setMovies,
                               loading, setLoading: setLoading,
                               setSelected: setSelected }}>
      <div className="App">
        <Header></Header>
        <Catalog></Catalog>
      </div>
    </MoviesContext.Provider>
  );
}

export default App;
