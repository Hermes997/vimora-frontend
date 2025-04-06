import React from 'react';
import CalendarComponent from './components/CalendarComponent';
import RbcEventForm from './components/RbcEventForm';
import useRbcSchedules from './hooks/useRbcSchedules';
import './styles/App.css';

const App = () => {
  const {
    rbcEvents,
    error,
    handleAddRbcEvent,
    handleEventResize,
    handleEventDrop,
    deleteRbcSchedule,
  } = useRbcSchedules();

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
    </div>
  );
};

export default App;