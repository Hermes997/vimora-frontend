// Import React hooks and components
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import EventForm from './components/EventForm';
import './App.css';

function App() {
  const [events, setEvents] = useState([]); // State for calendar events
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    // Retrieve schedules from the backend API
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      const calendarEvents = response.data.map(schedule => ({
        title: `${schedule.title} (Mood: ${schedule.mood})`,
        start: schedule.date,
        location: schedule.location,
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const handleAddEvent = async (eventData) => {
    // Add a new event to the backend and update the calendar
    try {
      const response = await axios.post(`${API_URL}/schedules`, {
        ...eventData,
        userId: 'user123', // Temporary user ID
      });
      setEvents([...events, {
        title: `${response.data.title} (Mood: ${response.data.mood})`,
        start: response.data.date,
        location: response.data.location,
      }]);
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const handleEventClick = (info) => {
    // Show event details on click
    alert(`Event: ${info.event.title}\nLocation: ${info.event.extendedProps.location}`);
  };

  const handleDateClick = (info) => {
    // Handle date click to potentially open event form (optional)
  };

  return (
    <div className="App">
      <h1>Vimora Planner</h1>
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]} // Plugins for calendar functionality
          initialView="dayGridMonth" // Default view as month
          events={events} // Display events on calendar
          eventClick={handleEventClick} // Handle event clicks
          dateClick={handleDateClick} // Handle date clicks
          height="auto"
          contentHeight="auto"
        />
      </div>
      <EventForm onAddEvent={handleAddEvent} /> // Form for adding new events
    </div>
  );
}

export default App; // Export the App component
