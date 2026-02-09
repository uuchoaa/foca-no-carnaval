import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateChipRow, type DateChipItem } from '../design-system';

interface DateFilterProps {
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  dates: string[];
  variant?: 'orange' | 'purple';
}

function formatDateShort(dateString: string) {
  try {
    const date = parseISO(dateString);
    return {
      day: format(date, 'd', { locale: ptBR }),
      weekday: format(date, 'EEE', { locale: ptBR }).slice(0, 3),
    };
  } catch {
    return { day: dateString, weekday: '' };
  }
}

export default function DateFilter({
  selectedDate,
  onDateChange,
  dates,
  variant = 'orange',
}: DateFilterProps) {
  const sortedDates = [...dates].sort();
  const items: DateChipItem[] = [
    { id: null, label: 'Todos' },
    ...sortedDates.map((date) => {
      const { day, weekday } = formatDateShort(date);
      return { id: date, label: day, sublabel: weekday };
    }),
  ];

  return (
    <DateChipRow
      label="Data"
      items={items}
      selectedId={selectedDate}
      onSelect={onDateChange}
      variant={variant}
    />
  );
}
