import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import ClientHeader from "../components/ClientHeader";
import API from "../../api/api";
import "../css/PaymentPage.css";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const api = new API();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Если зашли напрямую без данных
  if (!state) {
    return (
      <ClientLayout>
        <section className="payment-page">
          <ClientHeader />
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Нет данных для оплаты. Вернитесь к выбору мест.
          </p>
        </section>
      </ClientLayout>
    );
  }

  const {
    seanceId,
    ticketDate,
    tickets,
    movieInfo,
    totalPrice,
  } = state;

  const handlePayment = async () => {
    try {
      setLoading(true);

      console.log("Отправляем на сервер:", tickets);

      await api.buyTicket({
        seanceId: Number(seanceId),
        ticketDate,
        tickets,
      });

      navigate("/ticket", {
        state: {
          ...movieInfo,
          tickets,
          totalPrice,
          date: ticketDate,
        },
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Формируем строку мест (например: 5, 6, 7)
  const formattedSeats = Array.isArray(tickets)
    ? tickets
      .map((ticket) => {
        const row = Number(ticket.row);
        const place = Number(ticket.place);

        if (Number.isNaN(row) || Number.isNaN(place)) {
          return null;
        }

        return `ряд ${row} место ${place}`;
      })
      .filter(Boolean)
      .join(", ")
    : "";

  return (
    <ClientLayout>
      <section className="payment-page">
        <ClientHeader />
        <div className="payment-container">
          <div className="payment-container-wrapper"> {/* Для узора под заголовком */}
            <div className="payment-header__block">
              <h2 className="payment-header">Вы выбрали билеты:</h2>
            </div>
          </div>

          <div className="payment-info">
            <div className="payment__info-wrapper">

              <div className="payment__info">
                На фильм:
                <span className="payment__info-details">
                  {movieInfo?.filmName}
                </span>
              </div>

              <div className="payment__info">
                Места:
                <span className="payment__info-details">
                  {formattedSeats}
                </span>
              </div>

              <div className="payment__info">
                В зале:
                <span className="payment__info-details">
                  {movieInfo?.hallName}
                </span>
              </div>

              <div className="payment__info">
                Начало сеанса:
                <span className="payment__info-details">
                  {movieInfo?.sessionTime}
                </span>
              </div>

              <div className="payment__info">
                Стоимость:
                <span className="payment__info-details">
                  {totalPrice}
                </span>
                {" "}рублей
              </div>

              <div className="button-block">
                <button
                  type="button"
                  className="button"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Оплата..." : "Получить код бронирования"}
                </button>
              </div>

              {error && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {error}
                </div>
              )}

              <div className="payment__hint">
                После оплаты билет будет доступен в этом окне,
                а также придёт вам на почту.
                Покажите QR-код контроллёру у входа в зал.
              </div>

              <div className="payment__hint">
                Приятного просмотра!
              </div>

            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}