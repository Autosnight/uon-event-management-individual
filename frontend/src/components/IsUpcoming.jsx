// Treats date+time if provided; falls back to date-only at 00:00
export function isUpcoming(event) {
  if (!event?.date) return false;
  const today = new Date();
  let dt = new Date(event.date);

  // If you store "HH:mm" in event.time, combine it for precise comparison:
  if (event.time && /^\d{1,2}:\d{2}$/.test(event.time)) {
    const [h, m] = event.time.split(":").map(Number);
    dt.setHours(h, m, 0, 0);
  }
  return dt.getTime() > today.getTime();
}
