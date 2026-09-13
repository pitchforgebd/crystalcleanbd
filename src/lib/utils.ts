/**
 * Format a display phone string into a tel: href.
 * Strips spaces, dashes, and leading zeros for an E.164-like numeric string.
 */
export function phoneHref(displayPhone: string): string {
  const digits = displayPhone.replace(/[\s\-()]/g, "").replace(/^0+/, "");
  return `tel:+${digits}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Formats a stored timestamp without going through the host locale.
 *
 * `toLocaleString()` renders differently on the server and in the browser,
 * which makes React hydration fail on any page that shows a date.
 */
export function formatDateTime(value: string | Date): string {
  const iso = value instanceof Date ? value.toISOString() : value;
  const [datePart = "", timePart = ""] = iso.split("T");
  const [year, month, day] = datePart.split("-");
  if (!year || !month || !day) return iso;
  const time = timePart.slice(0, 5);
  return time ? `${day}/${month}/${year} ${time}` : `${day}/${month}/${year}`;
}
