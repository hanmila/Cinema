import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ShedulePage from "./pages/ShedulePage";
import HallPage from "./pages/HallPage";
import PaymentPage from "./pages/PaymentPage";
import TicketPage from "./pages/TicketPage";

const ClientRoutes = () => {
  return (
    <Routes>

      {/* Главная страница — расписание фильмов */}
      <Route path="/" element={<ShedulePage />} />

      {/* Страница выбора мест для конкретного сеанса (id сеанса передаётся в URL) */}
      <Route path="/booking/:seanceId" element={<HallPage />} />

      {/* Страница оплаты */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Страница билета после покупки */}
      <Route path="/ticket" element={<TicketPage />} />

      {/* Любой неизвестный путь → редиректим на главную */}
      <Route path="/*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default ClientRoutes;