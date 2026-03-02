import React from 'react';
import '../css/CollapsingHeader.css';
import arrowIcon from '../img/arrow.png';

const CollapsingHeader = ({ title, isOpen, toggle }) => {
  return (
    <div className="collapsible-header">
      <span className="collapsible-marker"></span>
      <h2 className="collapsible-title">{title}</h2>
      <img
        src={arrowIcon}
        alt="свернуть"
        className={`arrow ${isOpen ? 'open' : ''}`}
        onClick={toggle}
      />
    </div>
  );
};

export default CollapsingHeader;