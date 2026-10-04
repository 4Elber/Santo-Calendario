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
  return str.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();
}

// 12 distinct month color themes
const MONTH_THEMES = [
  { // 1 - Janeiro: azul inverno
    pageBg: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #ecfeff 100%)",
    primary: "#3b82f6",
    primaryDark: "#1e40af",
    primaryLight: "#dbeafe",
    primaryVeryLight: "#eff6ff",
    modalGradient: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
    textDark: "#1e3a8a",
    textMid: "#2563eb",
    textLight: "#93c5fd",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#60a5fa",
  },
  { // 2 - Fevereiro: rosa
    pageBg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fff1f2 100%)",
    primary: "#ec4899",
    primaryDark: "#9d174d",
    primaryLight: "#fce7f3",
    primaryVeryLight: "#fdf2f8",
    modalGradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
    textDark: "#831843",
    textMid: "#db2777",
    textLight: "#f9a8d4",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#f472b6",
  },
  { // 3 - Março: verde primavera
    pageBg: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
    primary: "#22c55e",
    primaryDark: "#14532d",
    primaryLight: "#dcfce7",
    primaryVeryLight: "#f0fdf4",
    modalGradient: "linear-gradient(135deg, #22c55e, #10b981)",
    textDark: "#14532d",
    textMid: "#16a34a",
    textLight: "#86efac",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#4ade80",
  },
  { // 4 - Abril: violeta lilás
    pageBg: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #f0f4ff 100%)",
    primary: "#8b5cf6",
    primaryDark: "#4c1d95",
    primaryLight: "#ede9fe",
    primaryVeryLight: "#f5f3ff",
    modalGradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
    textDark: "#3b0764",
    textMid: "#7c3aed",
    textLight: "#c4b5fd",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#a78bfa",
  },
  { // 5 - Maio: esmeralda
    pageBg: "linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #e0f2fe 100%)",
    primary: "#10b981",
    primaryDark: "#065f46",
    primaryLight: "#d1fae5",
    primaryVeryLight: "#ecfdf5",
    modalGradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    textDark: "#064e3b",
    textMid: "#059669",
    textLight: "#6ee7b7",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#34d399",
  },
  { // 6 - Junho: amarelo dourado
    pageBg: "linear-gradient(135deg, #fefce8 0%, #fffbeb 50%, #fef9c3 100%)",
    primary: "#ca8a04",
    primaryDark: "#713f12",
    primaryLight: "#fef3c7",
    primaryVeryLight: "#fefce8",
    modalGradient: "linear-gradient(135deg, #ca8a04, #d97706)",
    textDark: "#713f12",
    textMid: "#b45309",
    textLight: "#fde68a",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#fbbf24",
  },
  { // 7 - Julho: laranja
    pageBg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fef3c7 100%)",
    primary: "#f97316",
    primaryDark: "#7c2d12",
    primaryLight: "#ffedd5",
    primaryVeryLight: "#fff7ed",
    modalGradient: "linear-gradient(135deg, #f97316, #f59e0b)",
    textDark: "#7c2d12",
    textMid: "#ea580c",
    textLight: "#fdba74",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#fb923c",
  },
  { // 8 - Agosto: vermelho coral
    pageBg: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 50%, #fff5f5 100%)",
    primary: "#ef4444",
    primaryDark: "#7f1d1d",
    primaryLight: "#fee2e2",
    primaryVeryLight: "#fff1f2",
    modalGradient: "linear-gradient(135deg, #ef4444, #f97316)",
    textDark: "#7f1d1d",
    textMid: "#dc2626",
    textLight: "#fca5a5",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#f87171",
  },
  { // 9 - Setembro: teal outono
    pageBg: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 50%, #e0f2fe 100%)",
    primary: "#14b8a6",
    primaryDark: "#134e4a",
    primaryLight: "#ccfbf1",
    primaryVeryLight: "#f0fdfa",
    modalGradient: "linear-gradient(135deg, #14b8a6, #06b6d4)",
    textDark: "#134e4a",
    textMid: "#0d9488",
    textLight: "#5eead4",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#2dd4bf",
  },
  { // 10 - Outubro: laranja outonal
    pageBg: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fef2f2 100%)",
    primary: "#ea580c",
    primaryDark: "#7c2d12",
    primaryLight: "#ffedd5",
    primaryVeryLight: "#fff7ed",
    modalGradient: "linear-gradient(135deg, #ea580c, #dc2626)",
    textDark: "#431407",
    textMid: "#c2410c",
    textLight: "#fb923c",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#f97316",
  },
  { // 11 - Novembro: roxo/índigo outonal
    pageBg: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
    primary: "#6366f1",
    primaryDark: "#312e81",
    primaryLight: "#e0e7ff",
    primaryVeryLight: "#eef2ff",
    modalGradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    textDark: "#312e81",
    textMid: "#4f46e5",
    textLight: "#a5b4fc",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#818cf8",
  },
  { // 12 - Dezembro: vermelho natalino
    pageBg: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fdf2f8 100%)",
    primary: "#dc2626",
    primaryDark: "#7f1d1d",
    primaryLight: "#fee2e2",
    primaryVeryLight: "#fff1f2",
    modalGradient: "linear-gradient(135deg, #dc2626, #9f1239)",
    textDark: "#7f1d1d",
    textMid: "#b91c1c",
    textLight: "#fca5a5",
    headerBg: "rgba(255,255,255,0.92)",
    weekLabelColor: "#f87171",
  },
];

const MONTH_NAMES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const weekDayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const theme = MONTH_THEMES[currentMonth.getMonth()];

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

  const searchResults = useMemo(() => {
    const q = normalize(searchQuery.trim());
    if (q.length < 2) return [];
    return Object.entries(santos)
      .filter(([, s]) => normalize(s.nome).includes(q))
      .sort(([, a], [, b]) => normalize(a.nome).indexOf(q) - normalize(b.nome).indexOf(q))
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

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function handleSearchSelect(key: string) {
    const [mm, dd] = key.split("-").map(Number);
    const targetDate = new Date(currentMonth.getFullYear(), mm - 1, dd);
    setCurrentMonth(new Date(currentMonth.getFullYear(), mm - 1, 1));
    setSelectedDate(targetDate);
    setModalOpen(true);
    closeSearch();
  }

  function handlePrevMonth() {
    setCurrentMonth((prev) => subMonths(prev, 1));
  }

  function handleNextMonth() {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (modalOpen || searchOpen) return;
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (modalOpen || searchOpen) return;
    if (touchStartX.current === null || touchStartY.current === null) return;
    if (e.changedTouches.length !== 1) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    const minSwipeDistance = 45;

    // Must be predominantly horizontal gesture to avoid triggering on vertical scroll
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      isSwipingRef.current = true;
      setTimeout(() => {
        isSwipingRef.current = false;
      }, 150);

      if (deltaX < 0) {
        // Swiped left -> Next month
        handleNextMonth();
      } else {
        // Swiped right -> Previous month
        handlePrevMonth();
      }
    }
  }

  function handleTouchCancel() {
    touchStartX.current = null;
    touchStartY.current = null;
  }

  function handleDayClick(date: Date) {
    if (isSwipingRef.current) return;
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
    <div
      className="min-h-screen flex flex-col transition-all duration-700"
      style={{ background: theme.pageBg }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md border-b shadow-sm transition-all duration-700"
        style={{ background: theme.headerBg, borderColor: theme.primaryLight }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + Title */}
          <div className={`flex items-center gap-2 flex-shrink-0 ${searchOpen ? 'hidden sm:flex' : ''}`}>
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-700 flex-shrink-0"
              style={{ background: theme.modalGradient }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1
                className="text-sm sm:text-xl font-bold leading-tight tracking-tight transition-colors duration-700"
                style={{ color: theme.textDark }}
              >
                Calendário dos Santos
              </h1>
              <p
                className="hidden sm:block text-xs leading-tight transition-colors duration-700"
                style={{ color: theme.textMid }}
              >
                Um santo para cada dia do ano
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div ref={searchContainerRef} className={`relative transition-all duration-300 ${searchOpen ? 'flex-1 w-full' : 'flex-1 max-w-sm'}`}>
            {searchOpen ? (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-sm border transition-all duration-300"
                style={{ background: theme.primaryVeryLight, borderColor: theme.primary }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: theme.primary }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome do santo..."
                  className="flex-1 bg-transparent text-sm outline-none min-w-0"
                  style={{ color: theme.textDark }}
                />
                <button
                  onClick={closeSearch}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: theme.textLight }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openSearch}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm w-full shadow-sm hover:shadow transition-all border"
                style={{
                  background: theme.primaryVeryLight,
                  borderColor: theme.primaryLight,
                  color: theme.textMid,
                }}
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">Pesquisar santo...</span>
              </button>
            )}

            {/* Search results dropdown */}
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-50 border"
                style={{ borderColor: theme.primaryLight }}
              >
                {searchResults.length === 0 ? (
                  <div className="px-4 py-5 text-center text-sm text-gray-400">
                    Nenhum santo encontrado para "
                    <span className="font-medium" style={{ color: theme.primary }}>
                      {searchQuery}
                    </span>
                    "
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
                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                            style={idx < searchResults.length - 1 ? { borderBottom: `1px solid ${theme.primaryLight}` } : {}}
                          >
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center shadow-sm"
                              style={{ background: theme.modalGradient }}
                            >
                              <span className="text-white text-xs font-bold leading-none">{dd}</span>
                              <span className="text-white/80 text-[9px] uppercase leading-none mt-0.5">
                                {monthName.slice(0, 3)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate" style={{ color: theme.textDark }}>
                                {s.nome}
                              </p>
                              <p className="text-xs" style={{ color: theme.textMid }}>
                                {dd} de {monthName}
                              </p>
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
      <main
        className="flex-1 max-w-5xl mx-auto w-full px-4 pt-6 pb-12 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm transition-all active:scale-95 border"
            style={{ borderColor: theme.primaryLight, color: theme.textMid }}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2
            className="text-xl sm:text-2xl font-bold capitalize transition-colors duration-700"
            style={{ color: theme.textDark }}
          >
            {monthLabel}
          </h2>

          <button
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm transition-all active:scale-95 border"
            style={{ borderColor: theme.primaryLight, color: theme.textMid }}
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
              className="text-center text-xs font-semibold uppercase tracking-wider py-2 transition-colors duration-700"
              style={{ color: theme.weekLabelColor }}
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

            let cellStyle: React.CSSProperties = {};
            let textStyle: React.CSSProperties = {};

            if (isCurrentDay) {
              cellStyle = {
                background: theme.modalGradient,
                boxShadow: `0 4px 14px ${theme.primary}55`,
                border: `2px solid ${theme.primary}`,
              };
              textStyle = { color: "#fff" };
            } else if (isSelected) {
              cellStyle = { background: theme.primaryLight, border: `2px solid ${theme.primary}` };
              textStyle = { color: theme.textDark };
            } else if (hasSanto && inMonth) {
              cellStyle = { background: "#fff", border: `1px solid ${theme.primaryLight}` };
              textStyle = { color: theme.textDark };
            } else {
              cellStyle = { background: "rgba(255,255,255,0.6)", border: "1px solid transparent" };
              textStyle = { color: "#9ca3af" };
            }

            return (
              <button
                key={idx}
                data-testid={`day-cell-${key}`}
                onClick={() => handleDayClick(d)}
                aria-label={`${format(d, "d 'de' MMMM", { locale: ptBR })}${hasSanto ? ` - ${santos[key].nome}` : ""}`}
                className={[
                  "relative flex flex-col items-center justify-center rounded-xl sm:rounded-2xl aspect-square transition-all duration-200 cursor-pointer",
                  "focus:outline-none",
                  !inMonth ? "opacity-30" : "hover:shadow-md active:scale-95",
                ].join(" ")}
                style={cellStyle}
              >
                <span className="text-sm sm:text-base font-semibold leading-none" style={textStyle}>
                  {format(d, "d")}
                </span>

                {hasSanto && inMonth && !isCurrentDay && (
                  <span
                    className="mt-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors"
                    style={{ background: isSelected ? theme.primary : theme.weekLabelColor }}
                  />
                )}
                {isCurrentDay && (
                  <span className="mt-0.5 w-1 h-1 rounded-full bg-white/70" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4 justify-center text-xs transition-colors duration-700">
          <span className="flex items-center gap-1.5" style={{ color: theme.textMid }}>
            <span
              className="w-3 h-3 rounded-full border-2 inline-block"
              style={{ borderColor: theme.primary }}
            />
            Hoje
          </span>
          <span className="flex items-center gap-1.5" style={{ color: theme.textMid }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: theme.weekLabelColor }} />
            Santo do dia
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
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
          "fixed z-50 inset-0 sm:flex sm:items-center sm:justify-center transition-all duration-300",
          modalOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full sm:translate-y-4 pointer-events-none",
        ].join(" ")}
      >
        <div
          data-testid="modal-card"
          className="bg-white sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[88vh] mx-0 sm:mx-4 flex flex-col"
        >
          {selectedDate && (
            <>
              {/* Modal header */}
              <div
                className="px-4 pt-12 pb-3 sm:px-6 sm:pt-6 sm:pb-5 relative flex-shrink-0 overflow-hidden"
                style={{
                  background: santo ? theme.modalGradient : "linear-gradient(135deg, #9ca3af, #6b7280)",
                }}
              >
                <div>
                  <button
                    data-testid="button-close-modal"
                    onClick={closeModal}
                    className="absolute top-3 right-3 sm:-top-1 sm:-right-1 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  <p className="text-white/80 text-xs sm:text-sm font-medium mb-1 sm:mb-1.5 capitalize pr-9">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </p>

                  <h3
                    data-testid="text-santo-nome"
                    className="text-lg sm:text-2xl font-bold text-white leading-snug pr-8 sm:pr-10"
                  >
                    {santo ? santo.nome : "Sem registro"}
                  </h3>

                  {santo && (
                    <div data-testid="list-virtudes" className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
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
              </div>

              {/* Modal body — scrollable */}
              <div className="flex-1 overflow-y-auto">
                {santo ? (
                  <div className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: theme.primary }} />
                      <h4
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: theme.textMid }}
                      >
                        História
                      </h4>
                    </div>
                    <div data-testid="text-santo-historia" className="space-y-3">
                      {santo.historia.split("\n\n").map((block, i) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;
                        const isHeading =
                          trimmed.length < 60 && !trimmed.endsWith(".") && !trimmed.includes("\n");
                        if (isHeading) {
                          return (
                            <p
                              key={i}
                              className="font-semibold text-sm mt-5 mb-1"
                              style={{ color: theme.primary }}
                            >
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
                    {santo.imagem && (
                      <figure className="mt-8">
                        <figcaption
                          className="text-sm font-semibold uppercase tracking-wider mb-3"
                          style={{ color: theme.textMid }}
                        >
                          Imagem
                        </figcaption>
                        <div className="rounded-2xl border overflow-hidden bg-gray-50 flex justify-center"
                          style={{ borderColor: theme.primaryLight }}
                        >
                          <img
                            src={santo.imagem}
                            alt={`Imagem de ${santo.nome}`}
                            loading="lazy"
                            className="block max-h-[28rem] max-w-full object-contain"
                          />
                        </div>
                      </figure>
                    )}
                    <p
                      className="mt-6 text-xs italic border-t pt-4"
                      style={{ color: theme.textLight, borderColor: theme.primaryLight }}
                    >
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

              {/* Modal footer */}
              <div
                className="px-6 py-4 flex-shrink-0 border-t"
                style={{ borderColor: theme.primaryLight }}
              >
                <button
                  data-testid="button-fechar"
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
                  style={{ background: theme.modalGradient }}
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
