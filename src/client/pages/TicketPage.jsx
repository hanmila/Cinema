import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ClientLayout from "../components/ClientLayout";
import ClientHeader from "../components/ClientHeader";
import QRCode from "qrcode";
import "../css/TicketPage.css";

export default function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  if (!location.state) {
    return (
      <ClientLayout>
        <ClientHeader />
        <div className="ticket-container">
          <p style={{ textAlign: "center", marginTop: "40px", color: "white" }}>
            Нет данных для билета. Вернитесь к оплате.
          </p>
        </div>
      </ClientLayout>
    );
  }

  const { filmName, hallName, sessionTime, tickets, totalPrice, date } =
    location.state;

  // Преобразуем места в строку: "Ряд 1 место 5, Ряд 1 место 6"
  const seatText = Array.isArray(tickets)
    ? tickets.map(s => `Ряд ${s.row} место ${s.place}`).join(", ")
    : tickets;

  // Формируем данные для QR-кода
  const qrValue = `Билет действителен строго на свой сеанс
Фильм: ${filmName}
Дата: ${date}
Время: ${sessionTime}
Зал: ${hallName}
Места: ${seatText}
Стоимость: ${totalPrice} руб`;

  // Генерация QR-кода
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrValue, { width: 200 }, err => {
        if (err) console.error("QR Error:", err);
      });
    }
  }, [qrValue]);

  return (
    <ClientLayout>
      <section className="ticket-page">
        <ClientHeader />
        <div className="ticket-container">
          <div className="ticket-container-wrapper">
            <div className="ticket-header__block">
              <h2 className="ticket-header">Электронный билет</h2>
            </div>
          </div>

          <div className="ticket-info">
            <div className="ticket__info-wrapper">

              <div className="ticket__info">
                На фильм:
                <span className="ticket__info-details">{filmName}</span>
              </div>

              <div className="ticket__info">
                Места:
                <span className="ticket__info-details">{seatText}</span>
              </div>

              <div className="ticket__info">
                В зале:
                <span className="ticket__info-details">{hallName}</span>
              </div>

              <div className="ticket__info">
                Начало сеанса:
                <span className="ticket__info-details">{sessionTime}</span>
              </div>

              <div className="ticket__info">
                Стоимость:
                <span className="ticket__info-details">{totalPrice}</span> рублей
              </div>

              {/* QR-код */}
              <canvas ref={canvasRef} className="qr-code" />

              <div className="ticket__hint">
                Покажите QR-код нашему контроллеру для подтверждения бронирования.
              </div>
              <div className="ticket__hint">Приятного просмотра!</div>
            </div>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
}