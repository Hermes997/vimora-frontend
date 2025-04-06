import React from 'react';
import '../styles/CustomEvent.css';

const CustomEvent = ({ event, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Seperate event click with delete click
    if (window.confirm(`Delete event "${event.title}"?`)) {
      onDelete(event.eventID);
    }
  };

  return (
    <div className="custom-event">
      <span className="event-title">{event.title}</span>
      <button className="delete-button" onClick={handleDeleteClick}>
        ✕
      </button>
    </div>
  );
};

export default CustomEvent;