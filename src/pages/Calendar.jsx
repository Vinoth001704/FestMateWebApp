import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from '../utils/api';
import './styles/Calendar.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ title = 'Calendar' }) => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { pathname } = useLocation();

  /* ── Clock refs ── */
  const hrRef = useRef(null);
  const minRef = useRef(null);
  const secRef = useRef(null);
  const [digitalTime, setDigitalTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = now.getHours() * 30;
      const mm = now.getMinutes() * 6;
      const ss = now.getSeconds() * 6;
      if (hrRef.current) hrRef.current.style.transform = `rotateZ(${hh + mm / 12}deg)`;
      if (minRef.current) minRef.current.style.transform = `rotateZ(${mm}deg)`;
      if (secRef.current) secRef.current.style.transform = `rotateZ(${ss}deg)`;
      setDigitalTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.title = title;
  }, [title]);

  /* ── Fetch events ── */
  useEffect(() => {
    (async () => {
      try {
        const data = await get('/api/event/all');
        const list = Array.isArray(data) ? data : data.events || data.data || [];
        setEvents(list);
      } catch {
        // silent
      }
    })();
  }, []);

  /* ── Calendar grid computation ── */
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();
    const lastDay = new Date(year, month, lastDate).getDay();

    const cells = [];

    // previous month trailing days
    for (let i = firstDay; i > 0; i--) {
      cells.push({ date: prevLastDate - i + 1, type: 'prev' });
    }
    // current month days
    for (let i = 1; i <= lastDate; i++) {
      cells.push({ date: i, type: 'current' });
    }
    // next month leading days
    for (let i = 1; i <= 6 - lastDay; i++) {
      cells.push({ date: i, type: 'next' });
    }

    return cells;
  }, [year, month]);

  /* ── Events grouped by day ── */
  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const d = new Date(ev.event_schedule || ev.date || ev.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(ev);
      }
    });
    return map;
  }, [events, year, month]);

  /* ── Navigation ── */
  const goPrev = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };
  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(null);
  };

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  /* ── Events for selected date ── */
  const selectedEvents = selectedDate ? eventsByDay[selectedDate] || [] : [];

  return (
    <div className="calendar-page">
      {/* Header */}
      <div className="calendar-page-header">
        <div className="calendar-page-title-group">
          <h2 className="calendar-page-title">
            <span className="material-symbols-rounded">calendar_month</span>
            {title}
          </h2>
        </div>
        <button className="calendar-today-btn" onClick={goToday}>Today</button>
      </div>

      <div className="calendar-top-row">
        {/* Analog Clock */}
        <div className="analog-clock-container">
          <div className="analog-clock-bg-circle c1" />
          <div className="analog-clock-bg-circle c2" />
          <div className="analog-clock">
            <div className="clock-center-dot" />
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="clock-marker"
                style={{ transform: `rotateZ(${i * 30}deg)` }}
              />
            ))}
            <div className="clock-hand hour-hand">
              <span ref={hrRef} className="hand-span hr" />
            </div>
            <div className="clock-hand minute-hand">
              <span ref={minRef} className="hand-span min" />
            </div>
            <div className="clock-hand second-hand">
              <span ref={secRef} className="hand-span sec" />
            </div>
          </div>
          <div className="digital-time">{digitalTime}</div>
        </div>

      <div className="calendar-wrapper">
        {/* Month Navigation */}
        <div className="calendar-nav">
          <span className="material-symbols-rounded calendar-arrow" onClick={goPrev}>chevron_left</span>
          <h3 className="calendar-month-label">{MONTHS[month]} {year}</h3>
          <span className="material-symbols-rounded calendar-arrow" onClick={goNext}>chevron_right</span>
        </div>

        {/* Weekday Header */}
        <div className="calendar-grid weekdays">
          {WEEKDAYS.map((w) => (
            <div key={w} className="calendar-cell weekday">{w}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="calendar-grid days">
          {days.map((cell, i) => {
            const hasEvents = cell.type === 'current' && eventsByDay[cell.date];
            const isActive = cell.type === 'current' && isToday(cell.date);
            const isSelected = cell.type === 'current' && selectedDate === cell.date;

            return (
              <div
                key={i}
                className={[
                  'calendar-cell day',
                  cell.type !== 'current' && 'inactive',
                  isActive && 'today',
                  isSelected && 'selected',
                  hasEvents && 'has-events',
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  if (cell.type === 'current') setSelectedDate(cell.date);
                }}
              >
                <span className="day-number">{cell.date}</span>
                {hasEvents && (
                  <div className="event-dots">
                    {eventsByDay[cell.date].slice(0, 3).map((_, j) => (
                      <span key={j} className="event-dot" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>{/* end calendar-top-row */}

      {/* Event Details Panel */}
      {selectedDate && (
        <div className="calendar-events-panel">
          <div className="calendar-events-header">
            <h4>
              {MONTHS[month]} {selectedDate}, {year}
            </h4>
            <span className="material-symbols-rounded calendar-events-close" onClick={() => setSelectedDate(null)}>close</span>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="calendar-no-events">
              <span className="material-symbols-rounded">event_busy</span>
              <p>No events on this day</p>
            </div>
          ) : (
            <div className="calendar-events-list">
              {selectedEvents.map((ev, i) => {
                const basePath = pathname.startsWith('/admin')
                  ? '/admin' : pathname.startsWith('/coordinator')
                  ? '/coordinator' : '/student';
                const time = new Date(ev.event_schedule || ev.date).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit',
                });
                return (
                  <a
                    key={i}
                    href={`${basePath}/events/api/${ev.event_id || ev._id}`}
                    className="calendar-event-card"
                  >
                    <div className="calendar-event-time">
                      <span className="material-symbols-rounded">schedule</span>
                      {time}
                    </div>
                    <div className="calendar-event-info">
                      <span className="calendar-event-name">{ev.event_Name || ev.title || 'Event'}</span>
                      <span className="calendar-event-venue">{ev.venue || ''}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
