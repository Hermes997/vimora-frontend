import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import CustomEvent from './CustomEvent';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../styles/CalendarComponent.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarComponent = ({ events, onEventDrop, onEventResize, onDelete }) => {
  return (
    <div className="big-calendar-test">
      <DnDCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable={true}
        style={{ height: 500 }}
        components={{
          event: (props) => <CustomEvent {...props} onDelete={onDelete} />,
        }}
      />
    </div>
  );
};

export default CalendarComponent;