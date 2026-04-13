import { useState, useRef, useEffect, useMemo } from "react";
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
import { ChevronLeft, ChevronRight, X, BookOpen, Sparkles, Search } from "lucide-react";
import { santos } from "@/data/santos";

function getKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Mn}/gu, "")
    .toLowerCase();
}

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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

  // Search results — filter by name, max 8 results
  const searchResults = useMemo(() => {
    const q = normalize(searchQuery.trim());
    if (q.length < 2) return [];
    return Object.entries(santos)
      .filter(([, s]) => normalize(s.nome).includes(q))
      .sort(([, a], [, b]) => {
        const ai = normalize(a.nome).indexOf(q);
        const bi = normalize(b.nome).indexOf(q);
        return ai - bi;
      })
      .slice(0, 8);
  }, [searchQuery]);

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
  }

  // Close search on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  // Close search on ESC
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function handleSearchSelect(key: string) {
    const [mm, dd] = key.split("-").map(Number);
    // Navigate to that month
    const targetDate = new Date(currentMonth.getFullYear(), mm - 1, dd);
    setCurrentMonth(new Date(currentMonth.getFullYear(), mm - 1, 1));
    setSelectedDate(targetDate);
    setModalOpen(true);
    closeSearch();
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
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-amber-900 leading-tight tracking-tight">
                Calendário dos Santos
              </h1>
              <p className="text-xs text-amber-600 leading-tight">Um santo para cada dia do ano</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-base font-bold text-amber-900 leading-tight">Calendário dos Santos</h1>
            </div>
          </div>

          {/* Search bar */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-sm">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 shadow-sm">
                <Search className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome do santo..."
                  className="flex-1 bg-transparent text-sm text-amber-900 placeholder-amber-400 outline-none min-w-0"
                />
                <button onClick={closeSearch} className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openSearch}
                className="flex items-center gap-2 bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-xl px-3 py-2 text-sm text-amber-600 hover:text-amber-800 transition-all w-full shadow-sm hover:shadow"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Pesquisar santo...</span>
              </button>
            )}

            {/* Search results dropdown */}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-5 text-center text-sm text-gray-400">
                    Nenhum santo encontrado para "<span className="font-medium text-amber-600">{searchQuery}</span>"
                  </div>
                ) : (
                  <ul>
                    {searchResults.map(([key, s], idx) => {
                      const [mm, dd] = key.split("-");
                      const monthName = MONTH_NAMES[Number(mm) - 1];
                      return (
                        <li key={key}>
                          <button
                            onClick={() => handleSearchSelect(key)}
                            className={[
                              "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-amber-50 transition-colors",
                              idx < searchResults.length - 1 ? "border-b border-amber-50" : "",
                            ].join(" ")}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex flex-col items-center justify-center shadow-sm">
                              <span className="text-white text-xs font-bold leading-none">{dd}</span>
                              <span className="text-white/80 text-[9px] uppercase leading-none mt-0.5">{monthName.slice(0, 3)}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-amber-900 truncate">{s.nome}</p>
                              <p className="text-xs text-amber-500">{dd} de {monthName}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
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
                    : isSelected
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
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl mx-0 sm:mx-4 flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        >
          {selectedDate && (
            <>
              {/* Modal header — sticky */}
              <div
                className={[
                  "px-6 pt-6 pb-5 relative flex-shrink-0",
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

                <p className="text-white/80 text-sm font-medium mb-1.5 capitalize">
                  {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>

                <h3
                  data-testid="text-santo-nome"
                  className="text-2xl font-bold text-white leading-snug pr-10"
                >
                  {santo ? santo.nome : "Sem registro"}
                </h3>

                {/* Virtudes inside header */}
                {santo && (
                  <div
                    data-testid="list-virtudes"
                    className="flex flex-wrap gap-1.5 mt-3"
                  >
                    {santo.virtudes.map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal body — scrollable */}
              <div className="flex-1 overflow-y-auto">
                {santo ? (
                  <div className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <h4 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                        História
                      </h4>
                    </div>
                    <div
                      data-testid="text-santo-historia"
                      className="space-y-3"
                    >
                      {santo.historia.split("\n\n").map((block, i) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;
                        const isHeading =
                          trimmed.length < 60 && !trimmed.endsWith(".") && !trimmed.includes("\n");
                        if (isHeading) {
                          return (
                            <p key={i} className="text-amber-700 font-semibold text-sm mt-5 mb-1">
                              {trimmed}
                            </p>
                          );
                        }
                        return (
                          <p key={i} className="text-gray-700 text-sm leading-relaxed">
                            {trimmed.split("\n").map((line, j, arr) => (
                              <span key={j}>
                                {line}
                                {j < arr.length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        );
                      })}
                    </div>
                    <p className="mt-6 text-xs text-amber-400 italic border-t border-amber-100 pt-4">
                      Fonte: santo.cancaonova.com
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-10 px-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                      Nenhum santo registrado para este dia ainda.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal footer — sticky */}
              <div className="px-6 py-4 flex-shrink-0 border-t border-amber-100">
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
