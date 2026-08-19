import { useState } from 'react';
import closeBtn from '../../../img/close.png';
import selectArrow from '../../../img/selectArrow.svg';
import timeIcon from '../../../img/timeIcon.svg';
import './PopupSession.css';

function PopupSession({ isOpen, onClose, onSubmit, selectedFilm, selectedHallId, halls, films }) {
  const [filmId, setFilmId] = useState(selectedFilm?.id);
  const [hallId, setHallId] = useState(selectedHallId);
  const [startTime, setStartTime] = useState("10:00");
  // Находим выбранный зал
  const selectedHall = halls.find(h => h.id === selectedHallId);

  if (!isOpen || !selectedFilm || !selectedHall) return null;
  console.log("Popup props:", { isOpen, selectedFilm });
  const handleAdd = () => {
    // передаём фильм, зал и время
    onSubmit({ hallId, filmId, startTime });
    onClose();
  };

  return (
    <div className="popup__overlay">
      <div className="popup__content-add-session">
        <div className="popup__header-block">
          <h2 className="popup__header">Добавление сеанса</h2>
          <img
            src={closeBtn}
            alt="закрыть"
            className="button_close"
            onClick={() => {
              onClose();
            }} />
        </div>

        <form action="#" className="popup__form">
          <label className="popup__form-field">
            <span className="form__label">Название зала</span>
            <div className="select-icon">
              <select
                value={hallId}
                className="popup__form-select"
                onChange={(e) => setHallId(Number(e.target.value))}
              >
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                ))}
              </select>
              <img
                src={selectArrow}
                alt=""
                className="time-icon"
              />
            </div>
          </label>
          <label className="popup__form-field">
            <span className="form__label">Название фильма</span>
            <div className="select-icon">
              <select
                value={filmId}
                className="popup__form-select"
                onChange={(e) => setFilmId(Number(e.target.value))}
              >
                {films.map(film => (
                  <option key={film.id} value={film.id}>
                    {film.film_name}
                  </option>
                ))}
              </select>
              <img
                src={selectArrow}
                alt=""
                className="time-icon"
              />
            </div>
          </label>
          <label className="popup__form-field">
            <span className="form__label">Время начала</span>
            <div className="input-icon">
              <input className="popup__form-select start-time" type="time" min="00:00" max="23:59" value={startTime}
                onChange={(e) => setStartTime(e.target.value)} required />
              <img
                src={timeIcon}
                alt=""
                className="time-icon"
              />
            </div>
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

export default PopupSession;