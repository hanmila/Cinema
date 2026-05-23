import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import ClientHeader from "../components/ClientHeader";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";
import Nav from "../components/Nav";
import API from "../../api/api";
import "../css/SchedulePage.css";

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
        <header className="schedule-header">
          <ClientHeader />
          <Button onClick={() => navigate("/admin/login")}>Войти</Button>
        </header>

        <Nav onDayChange={setSelectedDate} />

        <main className="schedule-container">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isTodaySelected={isTodaySelected}
              goToBooking={goToBooking} />
          ))}
        </main>
      </div>
    </ClientLayout>
  );
}