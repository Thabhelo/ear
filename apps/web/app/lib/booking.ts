/** Public Google Calendar appointment schedule (no /u/0/ path). */
const DEFAULT_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1M0OUWwW_1dvgd7rLXW_1aR5uSPUZWcI-geJxVJ9TMOS43x0AVwvZ5gGYHY2vL97dbg80G28Fh";

export function getBookingUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  const raw = fromEnv || DEFAULT_BOOKING_URL;
  return raw.replace(/\/calendar\/u\/\d+\/appointments\//, "/calendar/appointments/");
}
