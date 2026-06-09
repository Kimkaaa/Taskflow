const KOREA_TIME_OFFSET_MS = 9 * 60 * 60 * 1000;

export function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function getStartOfWeekInKorea(date = new Date()) {
  const koreaDate = new Date(date.getTime() + KOREA_TIME_OFFSET_MS);
  const day = koreaDate.getUTCDay();
  const daysFromMonday = (day + 6) % 7;

  const startOfWeekInKorea = Date.UTC(
    koreaDate.getUTCFullYear(),
    koreaDate.getUTCMonth(),
    koreaDate.getUTCDate() - daysFromMonday,
    0,
    0,
    0,
    0,
  );

  return new Date(startOfWeekInKorea - KOREA_TIME_OFFSET_MS);
}