import React, { useContext, useReducer } from "react";
import "./Catalog.css";
import imgPlaceholder from "./movie_placeholder.png";
import rewatchImg from "./two-circular-arrows.png";
import watchlistImg from "./not-watched.png";
import downloadImg from "./download.png";
import { MoviesContext } from "../../services/context";
import { Movie, getMovies } from "../../services/movies.service";


export const Catalog = () => {
  const { master, movies, loading, selected,
          setLoading, updateMovies, setSelected } = useContext(MoviesContext);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  // remove all selected cards
  const handleRemoval = () => {
    if (selected.length === 0)
      return;
    var newMovies : Movie[] = [];
    movies.map((movie) => {
      if (!selected.includes(movie.id))
      {
        newMovies.push(movie);
      }
    });
    setSelected([]);
    updateMovies(newMovies);
  }

  const handleCardClick = (id: number) => {
    if (selected.find(e => e === id))
    {
      setSelected(selected.filter(e => e !== id));
      return;
    }
    selected.push(id);
    forceUpdate();
  }

  const inSelected = (id : number) => {
    if (selected.find(e => e === id))
    {
      return true;
    }
    return false;
  }

  const getDirected = (director: string) => {
    setLoading(true);
    getMovies(master, "", "", "", "", "", "",
              director, "", "", "", "", "",
              "year", true, true, true, true)
      .then((movies) => {
        setLoading(false);
        updateMovies(movies);
      });
  }

  const getTag = (tag: string) => {
    setLoading(true);
    getMovies(master, "", "", "", "", "", tag,
              "", "", "", "", "", "",
              "watched", false, false, true, true)
      .then((movies) => {
        setLoading(false);
        updateMovies(movies);
      });
  }

  const getIcon = (prov : string) => {
    if (prov === "Netflix") return "https://a.ltrbxd.com/sm/upload/za/bp/jc/zn/netflix-small.png";
    if (prov === "Amazon Prime Video") return "https://images.justwatch.com/icon/52449861/s100"
    if (prov === "HBO Max") return "https://images.justwatch.com/icon/182948653/s100"
    if (prov === "Globo Play") return "https://images.justwatch.com/icon/136871678/s100"
    if (prov === "Mubi") return "https://a.ltrbxd.com/sm/upload/0t/1m/aa/u9/mubi.png?k=371edba60c"
    if (prov === "Google Play Movies") return "https://a.ltrbxd.com/sm/upload/o0/8s/mp/ej/google-small.png?k=c07a6d2d92"
    if (prov === "Disney Plus") return "https://images.justwatch.com/icon/147638351/s100"
    if (prov === "Criterion Channel") return "https://a.ltrbxd.com/sm/upload/j6/4v/o4/ru/criterionchannel-small.png?k=d168bd1a60"
    if (prov === "Star Plus") return "https://images.justwatch.com/icon/250272035/s100"
    if (prov === "local") return downloadImg;
    return imgPlaceholder;
  }

  if (loading) {
    return (<div>
              <h1>LOADING</h1>
            </div>);
  }
  return (
    <div className="catalogContainer" id="catalog">
      {movies.map((movie) => (
        <div className={"catalog__item" + (inSelected(movie.id) ? "__selected" : "")}
             tabIndex={0}
             key={movie.id}
             onClick={(e) => {if (e.ctrlKey) handleCardClick(movie.id);}}
             onKeyDown={(e) => {
               // if backspace or delete is pressed
               if (e.keyCode === 8 || e.keyCode === 46) {
                 handleRemoval();
               }
               }}
        >
          <div className="catalog__item__img">
              <img src={movie.picture || imgPlaceholder} alt={movie.title}
              />
          </div>
          <div className="catalog__item__info">
            <div className="titleYear">
              <span className="title">
            <a href={movie.lbFilmLink}>
              {movie.title}
            </a>
              </span>
              <span className="year">
                ({movie.year})
              </span>
            </div>
            <div className="watchedRating">
              <span className="watched">
                <a href={movie.lbDiaryLink}>{
                  movie.watched && movie.watched.split("-").length > 3?
                    movie.watched.substring(0, 10) : movie.watched
                }</a>
              </span>
              {
                <span className={(movie.rating)? "rating" : "year"}>
                  {movie.rating}
                </span>
              }
            </div>
            <div className="tags">
              {
                (movie.tags)?
                  movie.tags.map((tag) => (
                    <span className="tag"
                          onClick={(e) => getTag(tag)}>
                      {tag}
                    </span>
                  )) : <span></span>
              }
            </div>
            <div className="directors">
              {
                (movie.directors)?
                  movie.directors.map((director) => (
                    <span className="director"
                          onClick={(e) => getDirected(director)}>
                      {director}
                    </span>
                  )) : <span></span>
              }
            </div>
            <div className="available">
              {
                (movie.available)?
                  movie.available.map((prov) => (
                  <span>
                    <img className="provider" src={getIcon(prov)}
                    />
                  </span>
                  ))
                : <span></span>
              }
          </div>
            <div className="runtimeRewatch">
              <span className="runtime">
                {movie.runtime}min
              </span>
              {
                (movie.rewatch)?
                  <span className="rewatch">
                    <img src={rewatchImg}
                    />
                  </span>
                : (movie.watchlist)?
                  <span className="rewatch">
                    <img src={watchlistImg}
                    />
                  </span>
                : <span></span>
              }
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
