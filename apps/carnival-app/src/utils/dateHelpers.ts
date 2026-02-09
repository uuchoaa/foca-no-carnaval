import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '../types/events';
import type { GroupedByDate } from '../types/events';

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateTimeString: string): string {
  try {
    const date = parseISO(dateTimeString);
    return format(date, "dd/MM 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateTimeString;
  }
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function getDayOfWeek(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE', { locale: ptBR });
  } catch {
    return '';
  }
}

export function formatDateChip(dateString: string): { short: string; day: string } {
  try {
    const date = parseISO(dateString);
    const short = format(date, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase();
    const day = format(date, 'd');
    return { short, day };
  } catch {
    return { short: '', day: dateString };
  }
}

export function groupByDate(events: Event[]): GroupedByDate[] {
  const grouped: Record<string, Event[]> = {};

  events.forEach((event) => {
    const date = event.date;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(event);
  });

  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, evs]) => ({
      date,
      dayOfWeek: getDayOfWeek(date),
      events: evs.sort((a, b) => {
        const timeA = 'concentration' in a ? a.concentration.dateTime : a.dateTime;
        const timeB = 'concentration' in b ? b.concentration.dateTime : b.dateTime;
        return new Date(timeA).getTime() - new Date(timeB).getTime();
      }),
    }));
}
