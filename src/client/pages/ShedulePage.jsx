import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import ClientHeader from "../components/ClientHeader";
import Button from "../components/Button";
import Nav from "../components/Nav";
import API from "../../api/api";
import "../css/ShedulePage.css";

export default function SchedulePage() {
  const navigate = useNavigate();
  const api = useMemo(() => new API(), []);

  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ======================
  // Загрузка данных
  // ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAllData();
        setRawData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  // ======================
  // Фильтрация и группировка
  // ======================
  const movies = useMemo(() => {
    if (!rawData?.films || !rawData?.halls || !rawData?.seances) return [];

    const hallsMap = new Map(rawData.halls.map(h => [h.id, h]));

    return rawData.films
      .map(film => {
        const filmSeances = rawData.seances
          .filter(
            s =>
              s.seance_filmid === film.id &&
              hallsMap.get(s.seance_hallid)?.hall_open
          )
          .map(s => ({
            id: s.id,
            hallId: s.seance_hallid,
            hallName: hallsMap.get(s.seance_hallid).hall_name,
            time: s.seance_time,
          }));

        const hallsGrouped = {};
        filmSeances.forEach(seance => {
          if (!hallsGrouped[seance.hallId]) {
            hallsGrouped[seance.hallId] = {
              id: seance.hallId,
              name: seance.hallName,
              seances: [],
            };
          }
          hallsGrouped[seance.hallId].seances.push({
            id: seance.id,
            time: seance.time,
          });
        });

        const halls = Object.values(hallsGrouped);
        if (!halls.length) return null;

        return {
          id: film.id,
          title: film.film_name,
          description: film.film_description,
          durationCountry: `${film.film_duration} мин · ${film.film_origin || ""}`,
          imageSrc: film.film_poster,
          halls,
        };
      })
      .filter(Boolean);
  }, [rawData]);

  // ======================
  // Навигация на бронирование
  // ======================
  const goToBooking = (seanceId, time) => {
    navigate(`/booking/${seanceId}`, {
      state: { seanceId, time, date: selectedDate },
    });
  };

  // ======================
  // Загрузка и ошибки
  // ======================
  if (loading) return <ClientLayout><div>Загрузка...</div></ClientLayout>;
  if (error) return <ClientLayout><div>Ошибка: {error}</div></ClientLayout>;

  // ======================
  // Текущая дата и время
  // ======================
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const todayISO = new Date().toISOString().slice(0, 10);

  // Приводим selectedDate к ISO формату
  const normalizeDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  };

  const selectedISO = normalizeDate(selectedDate);
  const isTodaySelected = selectedISO === todayISO;

  return (
    <ClientLayout>
      <div className="schedule-page">
        <div className="schedule-header">
          <ClientHeader />
          <Button onClick={() => navigate("/admin/login")}>Войти</Button>
        </div>

        <Nav onDayChange={setSelectedDate} />

        <main className="schedule-page-container">
          {movies.map(movie => (
            <section key={movie.id} className="movie-card-container">
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
                  <div className="movie__synopsis">{movie.description}</div>
                  <div className="movie__data">
                    <p>{movie.durationCountry.split("·")[0]}</p>
                    <p>{movie.durationCountry.split("·")[1] || ""}</p>
                  </div>
                </div>
              </div>

              {movie.halls.map(hall => (
                <div className="movie-seances__hall" key={hall.id}>
                  <h3>{hall.name}</h3>
                  <ul>
                    {hall.seances.map(seance => {
                      let isPast = false;

                      if (isTodaySelected) {
                        const now = new Date();
                        const [h, m] = seance.time.split(":").map(Number);

                        const seanceDateTime = new Date();
                        seanceDateTime.setHours(h, m, 0, 0);

                        isPast = seanceDateTime.getTime() < now.getTime();
                      }

                      return (
                        <li key={seance.id}>
                          <a
                            href="#0"
                            className="category-item"
                            style={{
                              pointerEvents: isPast ? "none" : "auto",
                              opacity: isPast ? 0.4 : 1,
                              cursor: isPast ? "not-allowed" : "pointer",
                            }}
                            onClick={e => {
                              e.preventDefault();
                              if (!isPast) {
                                goToBooking(seance.id, seance.time);
                              }
                            }}
                          >
                            {seance.time}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>
    </ClientLayout>
  );
}