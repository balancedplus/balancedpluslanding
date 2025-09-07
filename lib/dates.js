// lib/dates.js
export function dateToInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Recibe "YYYY-MM-DD" del <input type="date"> y devuelve [start, end) en hora local
export function dayBoundsFromInput(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = new Date(y, m - 1, d, 0, 0, 0, 0);
  const end = new Date(y, m - 1, d + 1, 0, 0, 0, 0);
  return { start, end };
}

export function formatHour(tsOrDate) {
  const d = tsOrDate?.toDate ? tsOrDate.toDate() : tsOrDate;
  return new Date(d).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}
