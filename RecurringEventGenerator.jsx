05.13 19:59
// RecurringEventGenerator.jsx
import React, { useState } from 'react';
import { format, addWeeks, isWithinInterval, addDays, parseISO } from 'date-fns';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const RecurringEventGenerator = () => {
  const [startDate, setStartDate] = useState('');
  const [time, setTime] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [occurrences, setOccurrences] = useState(1);
  const [viewStart, setViewStart] = useState('');
  const [viewEnd, setViewEnd] = useState('');
  const [isDaily, setIsDaily] = useState(false);
  const [events, setEvents] = useState([]);

  const generateInstances = () => {
    const result = [];
    const start = new Date(startDate);
    let count = 0;

    while (count < occurrences) {
      let eventDate;

      if (isDaily) {
        eventDate = addDays(start, count);
      } else {
        const startDay = start.getDay();
        const targetDay = daysOfWeek.indexOf(dayOfWeek);
        const diff = (targetDay + 7 - startDay) % 7;
        eventDate = addWeeks(addDays(start, diff), count);
      }

      result.push({
        date: format(eventDate, 'yyyy-MM-dd'),
        time
      });

      count++;
    }

    setEvents(result);
  };

  const isInViewWindow = (eventDate) => {
    if (!viewStart || !viewEnd) return true;
    const date = parseISO(eventDate);
    return isWithinInterval(date, { start: new Date(viewStart), end: new Date(viewEnd) });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Recurring Event Generator</h2>

      <div className="mb-2">
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Time: </label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      </div>

      <div className="mb-2">
        <label>Repeat Daily: </label>
        <input type="checkbox" checked={isDaily} onChange={e => setIsDaily(e.target.checked)} />
      </div>

      {!isDaily && (
        <div className="mb-2">
          <label>Day of Week: </label>
          <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)}>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-2">
        <label>Occurrences: </label>
        <input type="number" value={occurrences} onChange={e => setOccurrences(e.target.value)} />
      </div>

      <div className="mb-2">
        <label>View Start Date: </label>
        <input type="date" value={viewStart} onChange={e => setViewStart(e.target.value)} />
      </div>

      <div className="mb-2">
        <label>View End Date: </label>
        <input type="date" value={viewEnd} onChange={e => setViewEnd(e.target.value)} />
      </div>

      <button onClick={generateInstances} className="bg-blue-500 text-white px-4 py-2 rounded">Generate Instances</button>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Generated Events:</h3>
        <ul>
          {events.map((event, index) => (
            <li
              key={index}
              className={`${isInViewWindow(event.date) ? 'text-black' : 'text-gray-400'}`}
            >
              {event.date} @ {event.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecurringEventGenerator;

