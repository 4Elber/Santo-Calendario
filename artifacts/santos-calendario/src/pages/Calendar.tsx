import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X, BookOpen, Sparkles } from "lucide-react";
import santos from "@/data/santos";

function getKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const today = new Date();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setTimeout(() => setSelectedDate(null), 300);
  }

  const selectedKey = selectedDate ? getKey(selectedDate) : null;
  const santo = selectedKey ? santos[selectedKey] : null;

  const monthLabel = format(currentMonth, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-900 leading-tight tracking-tight">
                Calendário dos Santos
              </h1>
              <p className="text-xs text-amber-600 leading-tight">Um santo para cada dia do ano</p>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            data-testid="button-prev-month"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm active:scale-95"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2
            data-testid="text-current-month"
            className="text-2xl font-bold text-amber-900 capitalize"
          >
            {monthLabel}
          </h2>

          <button
            data-testid="button-next-month"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm active:scale-95"
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week day labels */}
        <div className="grid grid-cols-7 mb-2">
          {weekDayLabels.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-semibold text-amber-500 uppercase tracking-wider py-2"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((d, idx) => {
            const key = getKey(d);
            const hasSanto = Boolean(santos[key]);
            const inMonth = isSameMonth(d, currentMonth);
            const isCurrentDay = isToday(d);
            const isSelected = selectedDate ? isSameDay(d, selectedDate) : false;

            return (
              <button
                key={idx}
                data-testid={`day-cell-${key}`}
                onClick={() => handleDayClick(d)}
                aria-label={`${format(d, "d 'de' MMMM", { locale: ptBR })}${hasSanto ? ` - ${santos[key].nome}` : ""}`}
                className={[
                  "relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl aspect-square transition-all duration-200 cursor-pointer group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  !inMonth
                    ? "opacity-30"
                    : "hover:shadow-md active:scale-95",
                  isCurrentDay
                    ? "ring-2 ring-amber-500 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                    : isSelected && hasSanto
                    ? "bg-amber-100 border-2 border-amber-400"
                    : hasSanto && inMonth
                    ? "bg-white border border-amber-100 hover:border-amber-300 hover:bg-amber-50"
                    : "bg-white/60 border border-transparent hover:bg-white/90",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-sm sm:text-base font-semibold leading-none",
                    isCurrentDay
                      ? "text-white"
                      : hasSanto && inMonth
                      ? "text-amber-900"
                      : "text-gray-500",
                  ].join(" ")}
                >
                  {format(d, "d")}
                </span>

                {hasSanto && inMonth && !isCurrentDay && (
                  <span className="mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-500 transition-colors" />
                )}

                {isCurrentDay && (
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/70" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 justify-center text-xs text-amber-700">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-amber-500 inline-block" />
            Hoje
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Santo do dia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-white border border-gray-200 inline-block opacity-40" />
            Sem registro
          </span>
        </div>
      </main>

      {/* Modal overlay */}
      <div
        data-testid="modal-overlay"
        onClick={closeModal}
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300",
          modalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={santo ? `Santo do dia: ${santo.nome}` : "Sem santo registrado"}
        className={[
          "fixed z-50 left-0 right-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center transition-all duration-300",
          modalOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 sm:translate-y-4 pointer-events-none",
        ].join(" ")}
      >
        <div
          data-testid="modal-card"
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg mx-0 sm:mx-4 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {selectedDate && (
            <>
              {/* Modal header */}
              <div
                className={[
                  "px-6 pt-6 pb-4 relative",
                  santo
                    ? "bg-gradient-to-br from-amber-500 to-orange-500"
                    : "bg-gradient-to-br from-gray-300 to-gray-400",
                ].join(" ")}
              >
                {/* Handle bar for mobile */}
                <div className="w-10 h-1 rounded-full bg-white/40 mx-auto mb-4 sm:hidden" />

                <button
                  data-testid="button-close-modal"
                  onClick={closeModal}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Fechar modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <p className="text-white/80 text-sm font-medium mb-1 capitalize">
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>

                <h3
                  data-testid="text-santo-nome"
                  className="text-2xl font-bold text-white leading-tight"
                >
                  {santo ? santo.nome : "Sem registro"}
                </h3>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5">
                {santo ? (
                  <>
                    {/* Historia */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                          História
                        </h4>
                      </div>
                      <p
                        data-testid="text-santo-historia"
                        className="text-gray-700 text-sm leading-relaxed"
                      >
                        {santo.historia}
                      </p>
                    </div>

                    {/* Virtudes */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                          Principais Virtudes
                        </h4>
                      </div>
                      <div
                        data-testid="list-virtudes"
                        className="flex flex-wrap gap-2"
                      >
                        {santo.virtudes.map((v) => (
                          <span
                            key={v}
                            className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      Nenhum santo registrado para este dia ainda.
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      O banco de dados de santos está sendo expandido continuamente.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="px-6 pb-6">
                <button
                  data-testid="button-fechar"
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors active:scale-95"
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
