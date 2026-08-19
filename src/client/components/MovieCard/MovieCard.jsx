import './MovieCard.css';

const MovieCard = ({
  movie,
  isTodaySelected,
  goToBooking,
}) => {
  return (
    <section className="movie-card-container">
      <div className="movie__info">
        <div className="movie__poster">
          <img
            className="picture-img"
            src={movie.imageSrc}
            alt={`Постер фильма ${movie.title}`}
          />
        </div>

        <div className="movie__description">
          <h2 className="movie__heading">{movie.title}</h2>

          <div className="movie__synopsis">
            {movie.description}
          </div>

          <div className="movie__data">
            <p>{movie.durationCountry.split("·")[0]}</p>
            <p>{movie.durationCountry.split("·")[1] || ""}</p>
          </div>
        </div>
      </div>

      {movie.halls.map(hall => (
        <div
          className="movie-seances__hall"
          key={hall.id}
        >
          <h3>{hall.name}</h3>

          <ul>
            {hall.seances.map(seance => {
              let isPast = false;

              if (isTodaySelected) {
                const now = new Date();

                const [h, m] = seance.time
                  .split(":")
                  .map(Number);

                const seanceDateTime = new Date();

                seanceDateTime.setHours(h, m, 0, 0);

                isPast =
                  seanceDateTime.getTime() <
                  now.getTime();
              }

              return (
                <li key={seance.id}>
                  <button
                    className="category-item"
                    disabled={isPast}
                    onClick={() =>
                      goToBooking(
                        seance.id,
                        seance.time
                      )
                    }
                  >
                    {seance.time}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default MovieCard;