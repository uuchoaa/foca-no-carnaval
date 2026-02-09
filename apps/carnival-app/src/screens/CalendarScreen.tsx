import { useState, useMemo, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
import { motion } from 'framer-motion';
import type { Event } from '../types/events';
import { Page, TabGroup } from '../design-system';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'pt-BR': ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
  eventType: 'bloco' | 'show';
}

type CalendarFilter = 'all' | 'blocos' | 'shows';

const calendarTabOptions = [
  { id: 'all' as const, label: 'Todos', selectedStyle: 'all' as const },
  { id: 'blocos' as const, label: 'Blocos', selectedStyle: 'orange' as const },
  { id: 'shows' as const, label: 'Shows', selectedStyle: 'purple' as const },
];

export default function CalendarScreen() {
  const { getAllEvents } = useEvents();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CalendarFilter>('all');
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  const allEvents = getAllEvents();
  const filteredEvents = allEvents.filter((e) => {
    if (filter === 'blocos') return e.eventType === 'bloco';
    if (filter === 'shows') return e.eventType === 'show';
    return true;
  });

  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    return filteredEvents.map((event) => {
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
    });
  }, [filteredEvents]);

  const { minDate, maxDate, defaultDate } = useMemo(() => {
    if (calendarEvents.length === 0) {
      const today = new Date();
      return {
        minDate: startOfDay(today),
        maxDate: endOfDay(today),
        defaultDate: today,
      };
    }
    const dates = calendarEvents.map((e) => e.start);
    const min = new Date(Math.min(...dates.map((d) => d.getTime())));
    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
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

  const handleNavigate = (newDate: Date) => {
    const t = newDate.getTime();
    const clamped = new Date(
      Math.min(maxDate.getTime(), Math.max(minDate.getTime(), t))
    );
    setCurrentDate(clamped);
  };

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.eventType === 'bloco' ? '#FF8C00' : '#9370DB',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '12px',
      padding: '2px 4px',
    },
  });

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate(`/event/${event.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Page>
        <Page.Header
          gradient="calendar"
          title="Agenda"
          subtitle={`${filteredEvents.length} evento${filteredEvents.length !== 1 ? 's' : ''}`}
        />
        <TabGroup
          options={calendarTabOptions}
          selectedId={filter}
          onSelect={(id) => setFilter(id as CalendarFilter)}
        />
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
      </Page>
    </motion.div>
  );
}
