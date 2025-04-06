import { useState, useEffect } from 'react';
import { fetchRbcSchedules, addRbcEvent, updateRbcEvent, deleteRbcEvent } from '../api/rbcSchedules';

const useRbcSchedules = () => {
  const [rbcEvents, setRbcEvents] = useState([]);
  const [error, setError] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState(''); // For snack bar

  const fetchSchedules = async () => {
    try {
      const events = await fetchRbcSchedules();
      setRbcEvents(events);
      setError(events.length === 0 ? 'No events found. Please add a new event.' : '');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rbc schedules:', err);
    }
  };

  const handleAddRbcEvent = async (rbcEventData) => {
    try {
      const newEvent = await addRbcEvent(rbcEventData);
      await fetchSchedules(); // refresh
      setError('');
      setSnackbarMessage('Event added successfully');
    } catch (err) {
      setError(err.message);
      console.error('Error adding schedule:', err);
    }
  };

  const handleEventResize = async (resizeEventData, view) => {
    try {
      const { event, start, end } = resizeEventData;
      const eventID = event.eventID;

      const startDate = start instanceof Date ? start : new Date(start);
      const endDate = end instanceof Date ? end : new Date(end);

      if (isNaN(startDate) || isNaN(endDate)) {
        throw new Error('Invalid start or end date');
      }

      // If Month case, set time to 00:00
      if (view === 'month') {
        console.log('Setting time to 00:00 in Month view');
        startDate.setHours(0, 0, 0, 0); // 00:00:00.000
        endDate.setHours(0, 0, 0, 0);
        setSnackbarMessage('Event time set to 00:00 in Month view'); // output snack bar
      }

      const updatedEvent = await updateRbcEvent(eventID, {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      setRbcEvents(prevEvents =>
        prevEvents.map(rbcEvent =>
          rbcEvent.eventID === eventID
            ? { ...rbcEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) }
            : rbcEvent
        )
      );
      setError('');
    } catch (err) {
      setError(err.message);
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

      const updatedEvent = await updateRbcEvent(eventID, {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });

      setRbcEvents(prevEvents =>
        prevEvents.map(rbcEvent =>
          rbcEvent.eventID === eventID
            ? { ...rbcEvent, start: new Date(updatedEvent.start), end: new Date(updatedEvent.end) }
            : rbcEvent
        )
      );
      setError('');
      setSnackbarMessage('Event moved successfully');
    } catch (err) {
      setError(err.message);
      console.error('Error updating schedule:', err);
    }
  };

  const deleteRbcSchedule = async (eventID) => {
    try {
      await deleteRbcEvent(eventID);
      await fetchSchedules();
      setError('');
      setSnackbarMessage('Event deleted successfully');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting rbc schedule:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    rbcEvents,
    error,
    fetchSchedules,
    handleAddRbcEvent,
    handleEventResize,
    handleEventDrop,
    deleteRbcSchedule,
    snackbarMessage,
    setSnackbarMessage,
  };
};

export default useRbcSchedules;