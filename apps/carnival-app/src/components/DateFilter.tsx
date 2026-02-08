import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Button, Text } from '../design-system';

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
      full: format(date, "EEE, d 'de' MMM", { locale: ptBR }),
    };
  } catch {
    return { day: dateString, weekday: '', full: dateString };
  }
}

export default function DateFilter({
  selectedDate,
  onDateChange,
  dates,
  variant = 'orange',
}: DateFilterProps) {
  const sortedDates = [...dates].sort();
  const variantStyles = {
    orange: 'bg-carnival-orange',
    purple: 'bg-carnival-purple',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <Text variant="small" className="block text-gray-700 mb-3 font-medium">
        Data
      </Text>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedDate ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onDateChange(null)}
          className={clsx(
            'flex-shrink-0',
            !selectedDate && variant === 'orange' && '!bg-gray-900',
            !selectedDate && variant === 'purple' && '!bg-gray-900'
          )}
        >
          Todos
        </Button>
        {sortedDates.map((date) => {
          const formatted = formatDateShort(date);
          const isSelected = selectedDate === date;
          return (
            <button
              key={date}
              type="button"
              onClick={() => onDateChange(date)}
              className={clsx(
                'flex-shrink-0 flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-lg transition-colors',
                isSelected
                  ? `${variantStyles[variant]} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              title={formatted.full}
            >
              <span className="text-xs uppercase font-medium opacity-80">
                {formatted.weekday}
              </span>
              <span className="text-lg font-bold">{formatted.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
