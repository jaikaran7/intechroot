const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseYMD = (ymd) => {
  const [y, m, day] = String(ymd).split("-").map(Number);
  return new Date(y, m - 1, day, 0, 0, 0, 0);
};

export const addDaysISO = (isoDate, days) => {
  const d = parseYMD(isoDate);
  d.setDate(d.getDate() + days);
  return toYMD(d);
};

export const getWeekStartISO = (date) => {
  const d = date instanceof Date ? new Date(date) : parseYMD(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return toYMD(d);
};

/** All day keys used in timesheet grids (Mon–Sun). */
export const TIMESHEET_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const calculateTotal = (weekData) =>
  TIMESHEET_DAY_KEYS.reduce((sum, key) => sum + Number(weekData[key] || 0), 0);

/** Inclusive number of calendar days from start ISO to end ISO. */
export function daysInclusiveISO(startISO, endISO) {
  const a = parseYMD(startISO);
  const b = parseYMD(endISO);
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

function isWeekendDate(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

/**
 * Build Mon–Sun hour map for a period within a single calendar week (anchor = Monday of week containing periodStart).
 * Days outside [periodStart, periodEnd] are 0; weekend days in range start at 0; weekdays in range default to 8.
 */
export function buildWeekDataForPeriod(periodStartISO, periodEndISO) {
  const anchorMonday = parseYMD(getWeekStartISO(periodStartISO));
  const ps = parseYMD(periodStartISO);
  const pe = parseYMD(periodEndISO);
  ps.setHours(0, 0, 0, 0);
  pe.setHours(0, 0, 0, 0);
  const out = {};
  TIMESHEET_DAY_KEYS.forEach((key, i) => {
    const d = new Date(anchorMonday);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    const t = d.getTime();
    if (t < ps.getTime() || t > pe.getTime()) {
      out[key] = 0;
    } else if (isWeekendDate(d)) {
      out[key] = 0;
    } else {
      out[key] = 8;
    }
  });
  return out;
}

/** Range label for list/detail views; supports optional periodStart/periodEnd from the new-timesheet flow. */
export function formatTimesheetRangeLabel(sheet) {
  const startISO = sheet.periodStart ?? sheet.weekStart;
  const weekMon = getWeekStartISO(sheet.weekStart);
  const endISO = sheet.periodEnd ?? addDaysISO(weekMon, 4);
  const start = parseYMD(startISO);
  const end = parseYMD(endISO);
  const a = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const b = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${a} – ${b}`;
}

export function weekDayRows(weekStartISO) {
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const keys = TIMESHEET_DAY_KEYS;
  const mon = parseYMD(weekStartISO);
  return keys.map((key, i) => {
    const d = new Date(mon);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { key, label: labels[i], dateStr };
  });
}
