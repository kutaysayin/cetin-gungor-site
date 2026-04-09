/* Etkinlikler gorunum bileseni — liste/takvim ve yaklasan/gecmis sekmeleri */
"use client";

import { useState } from "react";
import { MapPin, Users, CalendarDays, List, Calendar } from "lucide-react";

// Tarihler string olarak server'dan gelmek zorunda (serialization)
interface SerializedEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string | null;
  capacity: number | null;
}

interface EventsViewProps {
  upcomingEvents: SerializedEvent[];
  pastEvents: SerializedEvent[];
}

const TURKCE_AYLAR_UZUN = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const TURKCE_AYLAR_KISA = [
  "OCA", "ŞUB", "MAR", "NİS", "MAY", "HAZ",
  "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA",
];

const TURKCE_GUNLER = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi",
];

function formatTurkishDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${TURKCE_GUNLER[d.getDay()]}, ${d.getDate()} ${TURKCE_AYLAR_UZUN[d.getMonth()]} ${d.getFullYear()} — ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Tek etkinlik liste karti
function EventListCard({
  event,
  isPast,
}: {
  event: SerializedEvent;
  isPast: boolean;
}) {
  const d = new Date(event.date);
  const month = TURKCE_AYLAR_KISA[d.getMonth()];
  const day = d.getDate();
  const excerpt =
    event.description.length > 140
      ? event.description.substring(0, 140) + "..."
      : event.description;

  return (
    <a
      href={`/etkinlikler/${event.slug}`}
      className={[
        "flex flex-col sm:flex-row gap-4 bg-white rounded-xl border border-neutral-100 p-5 hover:shadow-md transition-all duration-300 group",
        isPast ? "opacity-60" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Tarih blogu */}
      <div className="bg-secondary text-white rounded-lg p-3 flex flex-col items-center justify-center min-w-[72px] shrink-0 self-start">
        <span className="text-xs font-semibold tracking-widest uppercase opacity-90">
          {month}
        </span>
        <span className="text-3xl font-bold leading-none mt-0.5">{day}</span>
      </div>

      {/* Icerik */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-primary text-lg leading-tight mb-1.5 group-hover:text-secondary transition-colors">
          {event.title}
        </h3>

        {excerpt && (
          <p className="text-neutral-500 text-sm leading-relaxed mb-3 line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary-300 shrink-0" />
              {event.location}
            </span>
          )}
          {event.capacity && (
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-primary-300 shrink-0" />
              {event.capacity} kişi kapasiteli
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} className="text-primary-300 shrink-0" />
            {formatTurkishDateTime(event.date)}
          </span>
        </div>
      </div>

      {/* Sag: Kayit butonu (sadece yaklasan) */}
      {!isPast && (
        <div className="shrink-0 self-center">
          <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary-600 transition-colors">
            Kayıt Ol
          </span>
        </div>
      )}
    </a>
  );
}

// Takvim gorunumu — aylik grid
function CalendarView({ events }: { events: SerializedEvent[] }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const firstDay = new Date(year, month, 1).getDay(); // 0=Pazar
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Haftanin basi Pazartesi olsun
  const startOffset = (firstDay + 6) % 7;

  // Bu aydaki etkinlikler
  const eventsByDay: Record<number, SerializedEvent[]> = {};
  for (const ev of events) {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const gunBasliklari = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
      {/* Ay navigasyonu */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-primary-50">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-primary-100 transition-colors text-primary"
          aria-label="Önceki ay"
        >
          &#8249;
        </button>
        <span className="font-bold text-primary text-lg">
          {TURKCE_AYLAR_UZUN[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-primary-100 transition-colors text-primary"
          aria-label="Sonraki ay"
        >
          &#8250;
        </button>
      </div>

      {/* Gun basliklari */}
      <div className="grid grid-cols-7 border-b border-neutral-100">
        {gunBasliklari.map((g) => (
          <div
            key={g}
            className="py-3 text-center text-xs font-semibold text-neutral-400 uppercase tracking-wider"
          >
            {g}
          </div>
        ))}
      </div>

      {/* Gunler grid */}
      <div className="grid grid-cols-7">
        {/* Bos hucreler (ay baslangici icin) */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 border-b border-r border-neutral-50" />
        ))}

        {/* Gun hucreleri */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayEvents = eventsByDay[day] ?? [];
          const isToday =
            day === now.getDate() &&
            month === now.getMonth() &&
            year === now.getFullYear();

          return (
            <div
              key={day}
              className="h-20 border-b border-r border-neutral-50 p-1.5 flex flex-col"
            >
              <span
                className={[
                  "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1",
                  isToday
                    ? "bg-primary text-white"
                    : "text-neutral-500",
                ].join(" ")}
              >
                {day}
              </span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 2).map((ev) => (
                  <a
                    key={ev.id}
                    href={`/etkinlikler/${ev.slug}`}
                    className="text-[10px] leading-tight bg-secondary-100 text-secondary-700 rounded px-1 py-0.5 truncate hover:bg-secondary-200 transition-colors"
                    title={ev.title}
                  >
                    {ev.title}
                  </a>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-neutral-400 px-1">
                    +{dayEvents.length - 2} daha
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TabKey = "upcoming" | "past";
type ViewMode = "list" | "calendar";

export default function EventsView({ upcomingEvents, pastEvents }: EventsViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
  const isPast = activeTab === "past";

  const allEvents = [...upcomingEvents, ...pastEvents];

  return (
    <div>
      {/* Kontrol bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        {/* Sekmeler */}
        <div className="flex rounded-xl border border-neutral-200 overflow-hidden bg-white p-1 gap-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={[
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              activeTab === "upcoming"
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-50",
            ].join(" ")}
          >
            Yaklaşan ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={[
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              activeTab === "past"
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-50",
            ].join(" ")}
          >
            Geçmiş ({pastEvents.length})
          </button>
        </div>

        {/* Gorunum mod secici */}
        <div className="flex rounded-xl border border-neutral-200 overflow-hidden bg-white p-1 gap-1">
          <button
            onClick={() => setViewMode("list")}
            title="Liste görünümü"
            className={[
              "p-2.5 rounded-lg transition-all duration-200",
              viewMode === "list"
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-500 hover:bg-neutral-50",
            ].join(" ")}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            title="Takvim görünümü"
            className={[
              "p-2.5 rounded-lg transition-all duration-200",
              viewMode === "calendar"
                ? "bg-primary text-white shadow-sm"
                : "text-neutral-500 hover:bg-neutral-50",
            ].join(" ")}
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      {/* Icerik */}
      {viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {displayEvents.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <CalendarDays size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-lg">
                {isPast
                  ? "Henüz geçmiş etkinlik bulunmamaktadır."
                  : "Yaklaşan etkinlik bulunmamaktadır."}
              </p>
            </div>
          ) : (
            displayEvents.map((ev) => (
              <EventListCard key={ev.id} event={ev} isPast={isPast} />
            ))
          )}
        </div>
      ) : (
        <CalendarView events={allEvents} />
      )}
    </div>
  );
}
