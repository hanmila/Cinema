import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MovieCard.css";

const MovieCard = ({ id, title, description, durationCountry, imageSrc, halls = [], selectedDate,}) => {
  const navigate = useNavigate();

  // Проверка: является ли сеанс прошедшим
  const isSeanceExpired = (time) => {
    const now = new Date();
    const SeanceDate = new Date(selectedDate);

    const [hours, minutes] = time.split(":").map(Number);
    SeanceDate.setHours(hours, minutes, 0, 0);

    const todayString = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === todayString;

    return isToday && SeanceDate < now;
  };

  // Переход к бронированию
  const openBookingPage = (seanceId, time, hall) => {
    navigate(`/booking/${seanceId}`, {
      state: {
        filmId: id,
        filmName: title,
        hallName: hall.name,
        hallId: hall.id,
        SeanceTime: time,
        SeanceDate: selectedDate,
        fullDateTime: `${selectedDate} ${time}`,
      },
    });
  };

  // Мемоизированная сортировка залов
  const sortedHalls = useMemo(() => {
    return halls.map((hall) => ({
      ...hall,
      seances: [...hall.seances].sort((a, b) =>
        a.time.localeCompare(b.time)
      ),
    }));
  }, [halls]);

  return (
    <article className="movie-card">
      <div className="movie-card__header">
        <img
          src={imageSrc}
          alt={title}
          className="movie-card__poster"
          loading="lazy"
        />

        <div className="movie-card__info">
          <h3 className="movie-card__title">{title}</h3>
          <p className="movie-card__description">{description}</p>
          <span className="movie-card__meta">{durationCountry}</span>
        </div>
      </div>

      {sortedHalls.map((hall) => (
        <section
          key={hall.id}
          className="movie-card__hall"
          aria-labelledby={`hall-${hall.id}`}
        >
          <h4
            id={`hall-${hall.id}`}
            className="movie-card__hall-title"
          >
            {hall.name}
          </h4>

          <div className="movie-card__times">
            {hall.seances.map(({ id: seanceId, time }) => {
              const expired = isSeanceExpired(time);

              return (
                <button
                  key={seanceId}
                  type="button"
                  className={`movie-card__time${
                    expired ? " movie-card__time--disabled" : ""
                  }`}
                  disabled={expired}
                  onClick={() =>
                    !expired && openBookingPage(seanceId, time, hall)
                  }
                >
                  {time}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </article>
  );
}

export default MovieCard;