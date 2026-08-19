import React from 'react';
import './ClientLayout.css';


export default function Layout({ children }) {
  return (
    // Основной контейнер с классом layout //
    <div className="client-layout">
      {/* Здесь отображаются переданные дочерние компоненты */}
      {children}
    </div>
  );
}