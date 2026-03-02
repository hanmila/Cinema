import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import screen from "../img/screen.png";
import API from "../../api/api";
import "../css/CinemaHall.css";

export default function CinemaHall({
  seanceId: externalSeanceId,
  sessionDate: externalDate,
  onSelectionChange,
  onPricesLoad,
  zoomed,
  isMobileOrTablet
}) {
  const { seanceId: routeSeanceId } = useParams();
  const api = useMemo(() => new API(), []);

  const seanceId = externalSeanceId || routeSeanceId;
  const sessionDate = externalDate || new Date().toISOString().slice(0, 10);

  const [layout, setLayout] = useState([]);
  const [pickedSeats, setPickedSeats] = useState([]);
  const [prices, setPrices] = useState({ normal: null, vip: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Загрузка схемы и цен
  // =========================
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!seanceId) return;

      try {
        setLoading(true);
        setError(null);

        // загружаем схему зала
        const config = await api.getHallConfig(seanceId, sessionDate);
        if (!cancelled) setLayout(config || []);

        // получаем данные о зале для цен
        const allData = await api.getAllData();
        const seance = allData.seances.find(s => s.id === Number(seanceId));
        const hall = allData.halls.find(h => h.id === seance?.seance_hallid);

        if (!cancelled && hall) {
          const updatedPrices = {
            normal: Number(hall.hall_price_standart) || 0,
            vip: Number(hall.hall_price_vip) || 0
          };
          setPrices(updatedPrices);
          onPricesLoad?.(updatedPrices);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Ошибка загрузки зала");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => (cancelled = true);
  }, [seanceId, sessionDate, api, onPricesLoad]);

  // =========================
  // Выбор места
  // =========================
  const toggleSeat = useCallback((rowIndex, seatIndex) => {
    const type = layout?.[rowIndex]?.[seatIndex];
    if (!type || type === "taken" || type === "disabled") return;

    const key = `${rowIndex}_${seatIndex}`;
    setPickedSeats(prev =>
      prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key]
    );
  }, [layout]);

  // =========================
  // Пересчет выбранных билетов и суммы
  // =========================
  useEffect(() => {
    if (!layout.length || prices.normal == null || prices.vip == null) return;

    const seats = pickedSeats.map(id => {
      const [row, col] = id.split("_").map(Number);
      const type = layout[row][col];
      const cost = type === "vip" ? prices.vip : prices.normal;

      return {
        row: row + 1,
        place: col + 1,
        coast: cost
      };
    });

    const total = seats.reduce((sum, seat) => sum + seat.coast, 0);

    onSelectionChange?.(seats, total);
  }, [pickedSeats, layout, prices, onSelectionChange]);

  // =========================
  // Классы кресел для отображения
  // =========================
  const getSeatClass = (type, isActive) => {
    if (isActive) return "buying-scheme__chair chosen-chair";
    if (type === "vip") return "buying-scheme__chair free_vip";
    if (type === "taken") return "buying-scheme__chair taken";
    if (type === "disabled") return "buying-scheme__chair";
    return "buying-scheme__chair free";
  };

  if (loading) return <div className="buying-scheme">Загрузка зала...</div>;
  if (error) return <div className="buying-scheme">Ошибка: {error}</div>;

  return (
    <div className={`buying-scheme ${zoomed && isMobileOrTablet ? "zoomed" : ""}`}>
      <div className="buying-scheme__wrapper">
        <img src={screen} alt="Экран" className="screen" />
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className="buying-scheme__row">
            {row.map((seatType, seatIndex) => {
              const seatKey = `${rowIndex}_${seatIndex}`;
              const isSelected = pickedSeats.includes(seatKey);
              return (
                <span
                  key={seatIndex}
                  className={getSeatClass(seatType, isSelected)}
                  onClick={() => toggleSeat(rowIndex, seatIndex)}
                  title={`Ряд ${rowIndex + 1}, место ${seatIndex + 1}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="buying-scheme__legend">
        <div>
          <div className="buying-scheme__legend-price">
            <span className="buying-scheme__chair free"></span>
            <p>Свободно ({prices.normal ?? "—"} руб)</p>
          </div>
          <div className="buying-scheme__legend-price">
            <span className="buying-scheme__chair free_vip"></span>
            <p>Свободно VIP ({prices.vip ?? "—"} руб)</p>
          </div>
        </div>
        <div>
          <div className="buying-scheme__legend-price">
            <span className="buying-scheme__chair taken"></span>
            <p>Занято</p>
          </div>
          <div className="buying-scheme__legend-price">
            <span className="buying-scheme__chair chosen-chair"></span>
            <p>Выбрано</p>
          </div>
        </div>
      </div>
    </div>
  );
}