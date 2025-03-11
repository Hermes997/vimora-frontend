// Import React hooks for state management
import React, { useState } from 'react';

function EventForm({ onAddEvent }) {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    mood: 0,
  }); // State for new event data

  const handleSubmit = (e) => {
    // Handle form submission
    e.preventDefault();
    onAddEvent(newEvent);
    setNewEvent({ title: '', date: '', location: '', mood: 0 }); // Reset form
  };

  return (
    <div className="event-form">
      <input
        type="text"
        placeholder="Event Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <input
        type="date"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={newEvent.location}
        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
      />
      <input
        type="number"
        placeholder="Mood (1-5)"
        min="1"
        max="5"
        value={newEvent.mood}
        onChange={(e) => setNewEvent({ ...newEvent, mood: parseInt(e.target.value) || 0 })}
      />
      <button onClick={handleSubmit}>Add Event</button>
    </div>
  );
}

export default EventForm; // Export the EventForm component
