import React, { useState } from 'react';
import CalendarComponent from './components/CalendarComponent';
import RbcEventForm from './components/RbcEventForm';
import useRbcSchedules from './hooks/useRbcSchedules';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './styles/App.css';

const App = () => {
  const {
    rbcEvents,
    error,
    handleAddRbcEvent,
    handleEventResize,
    handleEventDrop,
    deleteRbcSchedule,
    snackbarMessage,
    setSnackbarMessage,
  } = useRbcSchedules();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Out put snack bar if message is modified.
  React.useEffect(() => {
    if (snackbarMessage) {
      setOpenSnackbar(true);
    }
  }, [snackbarMessage]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
    setSnackbarMessage(''); // reset message
  };

  return (
    <div className="App">
      <h1>Vimora Planner</h1>
      <CalendarComponent
        events={rbcEvents}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onDelete={deleteRbcSchedule}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <RbcEventForm onAddEvent={handleAddRbcEvent} />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // closed automatically in 3 sec
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;