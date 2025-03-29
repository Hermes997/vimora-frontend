import React from 'react';
import './CustomEvent.css';

const CustomEvent = ({ event, onDelete }) => {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // 이벤트 클릭과 삭제 클릭 분리
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