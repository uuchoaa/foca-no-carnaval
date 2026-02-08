import { useState, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarScreen() {
  const { getAllEvents } = useEvents();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'blocos', 'shows'

  const allEvents = getAllEvents();
  const [currentDate, setCurrentDate] = useState(null);

  const filteredEvents = allEvents.filter(event => {
    if (filter === 'blocos') return event.eventType === 'bloco';
    if (filter === 'shows') return event.eventType === 'show';
    return true;
  });

  const calendarEvents = useMemo(() => filteredEvents.map(event => {
    const isBloco = event.eventType === 'bloco';
    const startDate = isBloco
      ? new Date(event.concentration.dateTime)
      : new Date(event.dateTime);

    return {
      id: event.id,
      title: event.name,
      start: startDate,
      end: startDate,
      resource: event,
      eventType: event.eventType,
    };
  }), [filteredEvents]);

  const { minDate, maxDate, defaultDate } = useMemo(() => {
    if (calendarEvents.length === 0) {
      const today = new Date();
      return {
        minDate: startOfDay(today),
        maxDate: endOfDay(today),
        defaultDate: today,
      };
    }
    const dates = calendarEvents.map(e => e.start);
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    return {
      minDate: startOfDay(min),
      maxDate: endOfDay(max),
      defaultDate: min,
    };
  }, [calendarEvents]);

  const displayDate = currentDate ?? defaultDate;

  useEffect(() => {
    setCurrentDate(null);
  }, [filter]);

  const handleNavigate = (newDate) => {
    const t = newDate.getTime();
    const clamped = new Date(Math.min(maxDate.getTime(), Math.max(minDate.getTime(), t)));
    setCurrentDate(clamped);
  };

  const eventStyleGetter = (event) => {
    const isBloco = event.eventType === 'bloco';
    return {
      style: {
        backgroundColor: isBloco ? '#FF8C00' : '#9370DB',
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontSize: '12px',
        padding: '2px 4px',
      }
    };
  };

  const handleSelectEvent = (event) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-carnival-orange via-carnival-yellow to-carnival-purple text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Agenda</h1>
        <p className="text-sm mt-1 opacity-90">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filter */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 max-w-screen-xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('all')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Todos
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('blocos')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'blocos'
                ? 'bg-carnival-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Blocos
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter('shows')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'shows'
                ? 'bg-carnival-purple text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Shows
          </motion.button>
        </div>
      </div>

      {/* Calendar - agenda only, carnival date range */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            views={['agenda']}
            defaultView="agenda"
            date={displayDate}
            onNavigate={handleNavigate}
            min={minDate}
            max={maxDate}
            style={{ minHeight: 400 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            culture="pt-BR"
            messages={{
              next: 'Próximo',
              previous: 'Anterior',
              today: 'Hoje',
              date: 'Data',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'Nenhum evento neste período',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
