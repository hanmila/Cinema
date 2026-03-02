import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import Tooltip from "../components/Tooltip";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import API from "../../api/api";
import "../css/HallPage.css";

const HallPage = () => {
  const { state } = useLocation();
  const { seanceId: paramSeanceId } = useParams();
  const navigate = useNavigate();

  const api = new API();

  // Берём id либо из state, либо из url
  const seanceId = state?.seanceId || paramSeanceId;
  const sessionDate =
    state?.date || new Date().toISOString().split("T")[0];

  const [zoomed, setZoomed] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [prices, setPrices] = useState({ normal: 0, vip: 0 });
  const [movieInfo, setMovieInfo] = useState({
    filmName: "",
    sessionTime: "",
    hallName: "",
  });

  // ==========================
  // Загрузка информации о фильме
  // ==========================
  useEffect(() => {
    const loadSeanceInfo = async () => {
      try {
        const data = await api.getAllData();

        const seance = data.seances.find(
          (s) => String(s.id) === String(seanceId)
        );

        if (!seance) return;

        const film = data.films.find(
          (f) => f.id === seance.seance_filmid
        );

        const hall = data.halls.find(
          (h) => h.id === seance.seance_hallid
        );

        setMovieInfo({
          filmName: film?.film_name || "",
          sessionTime: seance.seance_time || "",
          hallName: hall?.hall_name || "",
        });
      } catch (error) {
        console.error("Ошибка загрузки данных сеанса", error);
      }
    };

    if (seanceId) {
      loadSeanceInfo();
    }
  }, [seanceId]);

  // ==========================
  // Выбор мест
  // ==========================
  const handleSeatSelection = useCallback((seats, price) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  }, []);

  // ==========================
  // Бронирование
  // ==========================
  const handleBook = () => {
    if (!selectedSeats.length) return;

    const tickets = selectedSeats.map((seat) => ({
      row: Number(seat.row),
      place: Number(seat.place),
      coast: seat.type === "vip" ? prices.vip : prices.normal,
    }));

    navigate("/payment", {
      state: {
        seanceId: Number(seanceId),
        ticketDate: sessionDate,
        tickets,
        movieInfo,
        totalPrice,
      },
    });
  };

  return (
    <ClientLayout>
      <div className="cinema-hall-page">
        <ClientHeader />

        <div className="cinema-hall-container">
          {/* Информация о фильме */}
          <div className="movie-info-row">
            <MovieInfo
              filmName={movieInfo.filmName}
              sessionTime={movieInfo.sessionTime}
              hallName={movieInfo.hallName}
            />
            <Tooltip onDoubleTap={() => setZoomed((prev) => !prev)} />
          </div>

          {/* Схема зала */}
          <div className="cinema-hall-info">
            <CinemaHall
              seanceId={seanceId}
              sessionDate={sessionDate}
              onSelectionChange={handleSeatSelection}
              onPricesLoad={setPrices}
              zoomed={zoomed}
              isMobileOrTablet={true}
            />
          </div>

          {/* Кнопка */}
          <div className="button-row">
            <Button
              onClick={handleBook}
              disabled={!selectedSeats.length}
            >
              Забронировать
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default HallPage;