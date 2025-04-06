import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://hermesmercury.quest:3001/api';

export const fetchRbcSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/rbc-schedules`);
    return response.data
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
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to fetch rbc schedules');
  }
};

export const addRbcEvent = async (rbcEventData) => {
  try {
    const response = await axios.post(`${API_URL}/rbc-schedules`, rbcEventData);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to add event');
  }
};

export const updateRbcEvent = async (eventID, eventData) => {
  try {
    const response = await axios.patch(`${API_URL}/rbc-schedules/${eventID}`, eventData);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to update event');
  }
};

export const deleteRbcEvent = async (eventID) => {
  try {
    await axios.delete(`${API_URL}/rbc-schedules/${eventID}`);
  } catch (err) {
    throw new Error(err.response?.data?.error || 'Failed to delete event');
  }
};