import React from 'react';
import '../css/ClientHeader.css';


const ClientHeader = () => {
  return (
    // чтобы задать css стили //
    <header className="client-header">
      <div className="client-header__container">
        <h1 className="client-header__title">
          Идём<span className="preposition">в</span>кино
        </h1>
      </div>
    </header>
  );
};

export default ClientHeader; 