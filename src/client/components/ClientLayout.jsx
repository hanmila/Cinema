import React from 'react';
import { Outlet } from 'react-router-dom'; //он уже не нужен, надо убрать после финальной проверки //
import '../css/ClientLayout.css';


export default function Layout({ children }) {
  return (
    // Основной контейнер с классом layout //
    <div className="client-layout">
      <div className="layout__overlay" /> {/*это тоже  нужно убрать после финальной проверки */}
      {/* Основной контент страницы */}
      <main className="container">
        {/* Здесь отображаются переданные дочерние компоненты */}
        {children}
      </main>
    </div>
  );
}