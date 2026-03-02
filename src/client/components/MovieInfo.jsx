import React from "react";
import "../css/MovieInfo.css";

// название фильма
// время сеанса
// название зала //
const MovieInfo = ({ filmName, sessionTime, hallName }) => {
  return (

    // Контейнер с классом для стилизации //
    <div className="movie-info">
      <div className="movie-info__description">

        <div className="movie-info__heading">
          {filmName || "Фильм не выбран"}
        </div>

        <div className="movie-info__session">
          Начало сеанса: {sessionTime || "--:--"}
        </div>

        <div className="movie-info__hall">
          {hallName || "Зал не выбран"}
        </div>

      </div>
    </div>
  );
}
export default MovieInfo;