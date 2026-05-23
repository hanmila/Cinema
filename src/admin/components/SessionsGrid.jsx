import React, { useState, useEffect } from "react";
import CollapsingHeader from "./CollapsingHeader";
// import trash from "../img/delete_btn.png";
import bin from "../img/bin.png";
import PopupFilm from "./PopupFilm";
import PopupSession from "./PopupSession";
import API from "../../api/api";
import "../css/SessionsGrid.css";

const api = new API();

function SessionsGrid({ films, setFilms, halls, setHalls }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isPopupFilmOpen, setIsPopupFilmOpen] = useState(false);
  const [isPopupSessionOpen, setIsPopupSessionOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedHallId, setSelectedHallId] = useState("");
  const [isDraggingSession, setIsDraggingSession] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [filmColors, setFilmColors] = useState(() => {
    return JSON.parse(localStorage.getItem("filmColors")) || {};
  });

  useEffect(() => {
    localStorage.setItem("filmColors", JSON.stringify(filmColors));
  }, [filmColors]);

  // --------------------
  // ФИЛЬМЫ
  // --------------------
  const generateColorById = (id) => {
    const colors = [
      "#CAFF85",
      "#85FF89",
      "#85FFD3",
      "#85E2FF",
      "#8599FF",
    ];

    return colors[id % colors.length];
  };

  // Удаление фильма
  const handleDeleteFilm = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить фильм?")) return;

    try {
      const response = await api.deleteFilm(id);
      // response.halls — обновлённый список залов с сервера
      setFilms(response.films);
      alert("Фильм успешно удалён");
    } catch (error) {
      console.error("Ошибка при удалении фильма:", error);
      alert("Не удалось удалить фильм");
    }

    // удалить фильм из залов
    const updatedHalls = halls.map((hall) => ({
      ...hall,
      sessions: (hall.sessions || []).filter((s) => s.filmId !== id),
    }));

    setHalls(updatedHalls);
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  {
    /* Для открытия и закрытия попапа фильма */
  }
  const openPopupFilm = () => setIsPopupFilmOpen(true);
  const closePopupFilm = () => setIsPopupFilmOpen(false);

  {
    /* Для открытия и закрытия попапа сеанса */
  }
  //const openPopupSession = () => setIsPopupSessionOpen(true);
  const closePopupSession = () => setIsPopupSessionOpen(false);

  // --------------------
  // DRAG & DROP
  // --------------------

  {
    /* Drag Start */
  }
  const handleDragStart = (e, film) => {
    e.dataTransfer.setData("filmId", film.id);
  };

  {
    /* DROP В ЗАЛ */
  }
  const handleDropToHall = (e, hallId) => {
    e.preventDefault();

    const filmId = e.dataTransfer.getData("filmId");
    const film = films.find((f) => f.id.toString() === filmId);

    if (!film) return;

    setSelectedFilm(film);
    setSelectedHallId(hallId);
    setIsPopupSessionOpen(true);

    {/*console.log(session);
    console.log(films); */}
  };

  // --------------------
  // Добавление сеанса
  // --------------------
  const handleAddSession = ({ filmId, hallId, startTime }) => {
    const updatedHalls = halls.map((hall) => {
      if (hall.id === hallId) {
        return {
          ...hall,
          sessions: [
            ...(hall.sessions || []),
            {
              id: Date.now(),
              filmId: filmId,
              start: startTime,
            },
          ],
        };
      }
      return hall;
    });

    setHalls(updatedHalls);
    setIsPopupSessionOpen(false);
    setSelectedFilm(null);
    setSelectedHallId(null);
  };

  // --------------------
  // Удаление сеанса
  // --------------------

  const handleDeleteSession = (hallId, sessionId) => {
    const updatedHalls = halls.map((hall) => {
      if (hall.id === hallId) {
        return {
          ...hall,
          sessions: hall.sessions.filter((s) => s.id !== sessionId),
        };
      }
      return hall;
    });

    setHalls(updatedHalls);
  };

  // --------------------
  // Сохранение данных
  // --------------------

  const handleSave = () => {
    // В API нет метода сохранить сеансы"
    // Поэтому кнопка "Сохранить" просто подтверждает изменения локально
    alert("Сохранено.");
  };

  // --------------------
  // Отмена изменений
  // --------------------
  const handleCancel = () => {
    if (window.confirm("Вы уверены, что хотите отменить?")) {
      window.location.reload();
    }
  };

  return (
    <section className="conf-step__wrapper-block sessions-grid">

      <div className="section-header__middle">
        <CollapsingHeader
          title="Сетка сеансов"
          isOpen={isOpen}
          toggle={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && (
        <div className="conf-step__wrapper section-style__middle">
          <button
            className="fieldset-button add-film__btn"
            onClick={openPopupFilm}
          >
            Добавить фильм
          </button>

          {/* ---------------- ФИЛЬМЫ ---------------- */}
          <div className="film-collection">
            {films.map((film) => (
              <div
                key={film.id}
                className="film-block"
                draggable
                onDragStart={(e) => handleDragStart(e, film)}
                style={{ backgroundColor: filmColors[film.id] || generateColorById(film.id) }}
              >
                <img
                  className="poster-picture"
                  src={film.film_poster}
                  alt={film.film_name}
                />
                <div className="film__description">
                  <span className="film-name">{film.film_name}</span>
                  <span className="film-duration">
                    {film.film_duration} минут
                  </span>
                </div>

                <button
                  className="delete__btn film-delete-btn"
                  onClick={() => handleDeleteFilm(film.id)}
                />
              </div>
            ))}
          </div>

          {/* ---------------- ЗАЛЫ ---------------- */}
          <div className="conf-step__sessions">
            {halls.map((hall) => (
              <div key={hall.id} className="conf-step__sessions-hall">
                <h3>{hall.hall_name}</h3>

                <div
                  className="conf-step__sessions-timeline"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropToHall(e, hall.id)}
                >
                  {(hall.sessions || [])
                    .sort(
                      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start),
                    )
                    .map((session) => {
                      const film = films.find((f) => String(f.id) === String(session.filmId));
                      if (!film) return null;

                      const start = timeToMinutes(session.start);
                      const duration = film.film_duration;

                      const left = (start / 1440) * 100; // % от суток
                      const width = (duration / 1440) * 100;

                      return (
                        <div
                          key={session.id}
                          className="conf-step__sessions-movie"
                          style={{
                            position: "absolute",
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: filmColors[film.id] || generateColorById(film.id)
                          }}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("sessionId", session.id);
                            e.dataTransfer.setData("hallId", hall.id);
                            setIsDraggingSession(true);
                          }}
                          onDragEnd={() => setIsDraggingSession(false)}
                        >
                          <div className="conf-step__sessions-movie-title">
                            {film.film_name}
                          </div>
                          <div className="conf-step__sessions-movie-start">
                            {session.start}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="fieldset">
            <button
              type="button"
              className="fieldset-button save__btn"
              onClick={handleSave}
            >
              Сохранить
            </button>
            <button
              type="button"
              className="fieldset-button cancel__btn"
              onClick={handleCancel}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <PopupFilm
        isOpen={isPopupFilmOpen}
        onClose={closePopupFilm}
        setFilms={setFilms}
        setFilmColors={setFilmColors}
      />

      <PopupSession
        key={`${selectedFilm?.id}-${selectedHallId}`}
        isOpen={isPopupSessionOpen}
        onClose={closePopupSession}
        onSubmit={handleAddSession}
        selectedFilm={selectedFilm}
        selectedHallId={selectedHallId}
        halls={halls}
        films={films}
      />

      {isDraggingSession && (
        <img
          src={bin}
          id="trash-bin"
          className="trash-bin"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const sessionId = e.dataTransfer.getData("sessionId");
            const hallId = e.dataTransfer.getData("hallId");
            if (!sessionId || !hallId) return;

            if (window.confirm("Удалить сеанс?")) {
              handleDeleteSession(Number(hallId), Number(sessionId));
              setIsDraggingSession(false); // ← корзина исчезает
            }
          }}
        />
      )}
    </section>
  );
}

export default SessionsGrid;
