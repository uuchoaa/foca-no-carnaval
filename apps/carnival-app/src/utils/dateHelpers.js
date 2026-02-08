import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(dateString) {
  try {
    const date = parseISO(dateString);
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  } catch (error) {
    return dateString;
  }
}

export function formatDateTime(dateTimeString) {
  try {
    const date = parseISO(dateTimeString);
    return format(date, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    return dateTimeString;
  }
}

export function formatTime(timeString) {
  return timeString; // Already in HH:MM format
}

export function getDayOfWeek(dateString) {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE', { locale: ptBR });
  } catch (error) {
    return '';
  }
}

export function groupByDate(events) {
  const grouped = {};
  
  events.forEach(event => {
    const date = event.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  });

  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, events]) => ({
      date,
      dayOfWeek: getDayOfWeek(date),
      events: events.sort((a, b) => {
        const timeA = a.concentration?.dateTime || a.dateTime;
        const timeB = b.concentration?.dateTime || b.dateTime;
        return new Date(timeA) - new Date(timeB);
      })
    }));
}
