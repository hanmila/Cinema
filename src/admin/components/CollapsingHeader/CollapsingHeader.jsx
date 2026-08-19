import React from 'react';
import arrowIcon from '../../img/arrow.png';
import './CollapsingHeader.css';

const CollapsingHeader = ({ title, isOpen, toggle }) => {
  return (
    <div className="collapsible-header">
      <span className="collapsible-marker"></span>
      <h2 className="collapsible-title">{title}</h2>
      <img
        src={arrowIcon}
        alt={isOpen ? 'Развернуто' : 'Свернуто'}
        className={`arrow ${isOpen ? 'open' : 'closed'}`}
        onClick={toggle}
      />
    </div>
  );
};

export default CollapsingHeader;