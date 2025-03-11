// Import Axios for HTTP requests
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch schedules from the backend
export const fetchSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/schedules`);
    return response.data;
  } catch (err) {
    console.error('Error fetching schedules:', err);
    throw err;
  }
};

// Create a new schedule in the backend
export const createSchedule = async (scheduleData) => {
  try {
    const response = await axios.post(`${API_URL}/schedules`, scheduleData);
    return response.data;
  } catch (err) {
    console.error('Error creating schedule:', err);
    throw err;
  }
};
