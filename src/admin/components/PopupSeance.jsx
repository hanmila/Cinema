import { useState, useEffect } from "react";
import closeBtn from '../img/close.png'
import API from "../../api/api";
import "../css/PopupSeance.css";

const api = new API();

function PopupSeance({ isOpen, onClose, onSubmit, selectedFilm, selectedHallId, halls, films }) {
  const [filmId, setFilmId] = useState(selectedFilm?.id);
  const [hallId, setHallId] = useState(selectedHallId);
  const [startTime, setStartTime] = useState("10:00");
  // Находим выбранный зал
  const selectedHall = halls.find(h => h.id === selectedHallId);

  useEffect(() => {
    if (isOpen) {
      setFilmId(selectedFilm?.id);
      setHallId(selectedHallId);
      setStartTime("00:00");
    }
  }, [isOpen, selectedHallId, selectedFilm]);

  if (!isOpen || !selectedFilm || !selectedHall) return null;
  console.log("Popup props:", { isOpen, selectedFilm });
  const handleAdd = () => {
    // передаём фильм, зал и время
    onSubmit({ hallId, filmId, startTime });
    onClose();
  };

  return (
    <div className="popup__overlay">
      <div className="popup__content-add-seance">
        <div className="popup__header-block">
          <h2 className="popup__header">Добавление сеанса</h2>
          <img
            src={closeBtn}
            alt="закрыть"
            className="button_close"
            onClick={() => {
              resetForm();
              onClose();
            }} />
        </div>

        <form action="#" className="popup__form">
          <label className="popup__form-field">
            <span className="form__label">Название зала</span>
            <select
              value={hallId}
              className="popup__form-select hall-name"
              onChange={(e) => setHallId(Number(e.target.value))}
            >
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
              ))}
            </select>
          </label>
          <label className="popup__form-field">
            <span className="form__label">Название фильма</span>
            <select
              value={filmId}
              className="popup__form-select film-name"
              onChange={(e) => setFilmId(Number(e.target.value))}
            >
              {films.map(film => (
                <option key={film.id} value={film.id}>
                  {film.film_name}
                </option>
              ))}
            </select>
          </label>
          <label className="popup__form-field">
            <span className="form__label">Время начала</span>
            <input className="popup__form-select start-time" type="time" min="00:00" max="23:59" value={startTime}
              onChange={(e) => setStartTime(e.target.value)} required />
          </label>
        </form>

        <div className="conf-step__buttons">
          <button type="submit" className="form__btn" onClick={handleAdd}>Добавить</button>
          <button type="submit" className="form__btn" onClick={onClose}>Отменить</button>
        </div>
      </div>
    </div>
  );
}

export default PopupSeance;