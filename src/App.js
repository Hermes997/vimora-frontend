// Import React hooks and components
import React, {useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios';
import RbcEventForm from './components/RbcEventForm';
import './App.css';
import './react-big-calendar.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

function App() {
  const [rbcEvents, setRbcEvents] = useState([]); // State for calendar events
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const localizer = momentLocalizer(moment)
  const DnDCalendar = withDragAndDrop(Calendar);
  const fetchSchedules = async () => {
    // Retrieve schedules from the backend API
    try {
      const rbcResponse = await axios.get(`${API_URL}/rbc-schedules`);
      const rbcCalendarEvents = rbcResponse.data.map(rbcSchedule => ({
        title: rbcSchedule.title,
        start: rbcSchedule.start,
        end: rbcSchedule.end,
        description: rbcSchedule.description,
        createdAt: rbcSchedule.createdAt,
      }));
      setRbcEvents(rbcCalendarEvents);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const handleAddRbcEvent = async (rbcEventData) => {
    // Add a new event to the backend and update the calendar
    try {
      const rbcResponse = await axios.post(`${API_URL}/rbc-schedules`, {
        ...rbcEventData,
      });
      setRbcEvents([...rbcEvents, {
        title: rbcResponse.data.title,
        start: rbcResponse.data.start,
        end: rbcResponse.data.end,
        description: rbcResponse.data.description,
      }]);
    } catch (err) {
      console.error('Error adding schedule:', err);
    }
  };

  const onEventResize = (data) => {
    const { start, end } = data;
    
    setRbcEvents((rbcEvents) => {
      rbcEvents.start = start;
      rbcEvents.end = end;
      handleAddRbcEvent(rbcEvents)
      return handleAddRbcEvent(rbcEvents);
    });
  };

  const onEventDrop = (data) => {
    console.log(data);
  };

  return (
    <div className="App">
      <h1>Vimora Planner</h1>
      <div className="big-calendar-test">
        <DnDCalendar
          localizer={localizer}
          events={rbcEvents}
          startAccessor="start"
          endAccessor="end"
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          style={{ height: 500 }}
        />
      </div>
      <RbcEventForm onAddEvent={handleAddRbcEvent}/>
    </div>
    
  );
}

export default App; // Export the App component
