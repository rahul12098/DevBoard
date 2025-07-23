
import React from 'react';
import '../styles/Card.css';

const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
