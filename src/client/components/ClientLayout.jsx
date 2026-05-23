import React from 'react';
import { Outlet } from 'react-router-dom'; //он уже не нужен, надо убрать после финальной проверки //
import '../css/ClientLayout.css';


export default function Layout({ children }) {
  return (
    // Основной контейнер с классом layout //
    <div className="client-layout">
      {/* Здесь отображаются переданные дочерние компоненты */}
      {children}
    </div>
  );
}