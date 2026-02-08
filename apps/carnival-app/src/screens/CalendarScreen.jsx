import { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts/EventsContext';
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
  
  const filteredEvents = allEvents.filter(event => {
    if (filter === 'blocos') return event.eventType === 'bloco';
    if (filter === 'shows') return event.eventType === 'show';
    return true;
  });

  const calendarEvents = filteredEvents.map(event => {
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
    <div className="min-h-screen bg-gray-50">
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
          <button
            onClick={() => setFilter('all')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('blocos')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'blocos'
                ? 'bg-carnival-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Blocos
          </button>
          <button
            onClick={() => setFilter('shows')}
            className={clsx(
              'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
              filter === 'shows'
                ? 'bg-carnival-purple text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Shows
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow-md p-4 overflow-auto">
          <BigCalendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            culture="pt-BR"
            messages={{
              next: 'Próximo',
              previous: 'Anterior',
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              agenda: 'Agenda',
              date: 'Data',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'Nenhum evento neste período',
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <h3 className="font-medium text-gray-900 mb-3">Legenda</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-carnival-orange rounded"></div>
              <span className="text-sm text-gray-700">Blocos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-carnival-purple rounded"></div>
              <span className="text-sm text-gray-700">Shows</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
