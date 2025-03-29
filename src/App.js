// Import React hooks and components
import React, {useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import axios from 'axios';
import CustomEvent from './CustomEvent';
import RbcEventForm from './components/RbcEventForm';
import './App.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

function App() {
  const [rbcEvents, setRbcEvents] = useState([]); // State for calendar events
  const API_URL = process.env.REACT_APP_API_URL;
  const [error, setError] = useState('');
  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const localizer = momentLocalizer(moment)
  const DnDCalendar = withDragAndDrop(Calendar);
  const fetchSchedules = async () => {
    // Retrieve schedules from the backend API
    try {
      const response = await axios.get(`${API_URL}/rbc-schedules`);
      const rbcCalendarEvents = response.data
        .filter(rbcSchedule => {
          const start = new Date(rbcSchedule.start);
          const end = new Date(rbcSchedule.end);
          if (isNaN(start) || isNaN(end)) {
            console.error('Invalid date in rbcSchedule:', rbcSchedule);
            return false;
          }
          return true;
        })
        .map(rbcSchedule => ({
          id: rbcSchedule._id,
          eventID: rbcSchedule.eventID,
          title: rbcSchedule.title,
          start: new Date(rbcSchedule.start),
          end: new Date(rbcSchedule.end),
          description: rbcSchedule.description,
          createdAt: new Date(rbcSchedule.createdAt),
        }));
      setRbcEvents(rbcCalendarEvents);
      if (rbcCalendarEvents.length === 0) {
        setError('No events found. Please add a new event.');
      } else {
        setError('');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch rbc schedules. Server may be down.';
      setError(errorMessage);
      console.error('Error fetching rbc schedules:', err);
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

  const handdleEventResize = async (resizeEventData) => {
    try {
      const { event, start, end } = resizeEventData;
      const eventID = event.eventID;
      console.log('resizeEventData:', resizeEventData);
  
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
  
      if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error('Invalid start or end date');
      }
  
      const rbcResponse = await axios.patch(`${API_URL}/rbc-schedules/${eventID}`, {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
  
      setRbcEvents(prevEvents =>
        prevEvents.map(rbcEvent =>
          rbcEvent.eventID === eventID
            ? { ...rbcEvent, start: new Date(rbcResponse.data.start), end: new Date(rbcResponse.data.end) }
            : rbcEvent
        )
      );
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update rbc schedule');
      console.error('Error updating schedule:', err);
    }
  };
  
  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const eventID = event.eventID;
  
      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);
  
      if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error('Invalid start or end date');
      }
  
      const rbcResponse = await axios.patch(`${API_URL}/rbc-schedules/${eventID}`, {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
  
      setRbcEvents(prevEvents =>
        prevEvents.map(rbcEvent =>
          rbcEvent.eventID === eventID
            ? { ...rbcEvent, start: new Date(rbcResponse.data.start), end: new Date(rbcResponse.data.end) }
            : rbcEvent
        )
      );
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update rbc schedule');
      console.error('Error updating schedule:', err);
    }
  };

  const deleteRbcSchedule = async (eventID) => {
    try {
      await axios.delete(`${API_URL}/rbc-schedules/${eventID}`);
      await fetchSchedules();
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete event';
      setError(errorMessage);
      console.error('Error deleting rbc schedule:', err);
    }
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
          onEventDrop={handleEventDrop}
          onEventResize={handdleEventResize}
          resizable={true}
          style={{ height: 500 }}
          components={{
            event: (props) => <CustomEvent {...props} onDelete={deleteRbcSchedule} />,
          }}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <RbcEventForm onAddEvent={handleAddRbcEvent}/>
    </div>
    
  );
}

export default App; // Export the App component
