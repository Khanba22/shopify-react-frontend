import React from 'react';
import './Notification.css';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification-container">
      <div className="notification">
        <p>{message}</p>
        <button className="notification-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
