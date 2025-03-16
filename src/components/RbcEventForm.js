// Import React hooks for state management
import React, { useState } from 'react';

function RbcEventForm({ onAddEvent }) {
  const [newRbcEvent, setNewRbcEvent] = useState({
    userId: '',
    title: '',
    start: '',
    end: '',
    description: '',
  }); // State for new event data

  const handleSubmit = (e) => {
    // Handle form submission
    e.preventDefault();
    onAddEvent(newRbcEvent);
    setNewRbcEvent({title: '', start: '', end: '',description: ''}); // Reset form
  };

  return (
    <div className="rbc-event-form">
      <input
        type="text"
        placeholder="title"
        value={newRbcEvent.title}
        onChange={(e) => setNewRbcEvent({ ...newRbcEvent, title: e.target.value })}
      />
      <input
        type="date"
        value={newRbcEvent.start}
        onChange={(e) => setNewRbcEvent({ ...newRbcEvent, start: e.target.value })}
      />
      <input
        type="date"
        value={newRbcEvent.end}
        onChange={(e) => setNewRbcEvent({ ...newRbcEvent, end: e.target.value })}
      />
      <input
        type="text"
        placeholder="description"
        value={newRbcEvent.description}
        onChange={(e) => setNewRbcEvent({ ...newRbcEvent, description: e.target.value })}
      />
      <button onClick={handleSubmit}>Add Event</button>
    </div>
  );
}

export default RbcEventForm; // Export the EventForm component
