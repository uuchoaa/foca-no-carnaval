import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

export default function DateFilter({ selectedDate, onDateChange, dates, variant = 'orange' }) {
  // Sort dates
  const sortedDates = [...dates].sort();

  const formatDateShort = (dateString) => {
    try {
      const date = parseISO(dateString);
      return {
        day: format(date, 'd', { locale: ptBR }),
        weekday: format(date, 'EEE', { locale: ptBR }).substring(0, 3),
        full: format(date, "EEE, d 'de' MMM", { locale: ptBR })
      };
    } catch (error) {
      return { day: dateString, weekday: '', full: dateString };
    }
  };

  const variantStyles = {
    orange: 'bg-carnival-orange',
    purple: 'bg-carnival-purple',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Data</h3>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onDateChange(null)}
          className={clsx(
            'flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors',
            !selectedDate
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Todos
        </button>
        {sortedDates.map(date => {
          const formatted = formatDateShort(date);
          const isSelected = selectedDate === date;
          return (
            <button
              key={date}
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
              <span className="text-lg font-bold">
                {formatted.day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
