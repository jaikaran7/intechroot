export const toYMD = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseYMD = (ymd) => {
  const [y, m, day] = String(ymd).split("-").map(Number);
  return new Date(y, m - 1, day, 0, 0, 0, 0);
};

/** Parse API / DB date: `YYYY-MM-DD`, ISO datetime, or Date. */
export function parseDbDateToLocalDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const s = String(value);
  const head = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(head) && !s.includes("T")) {
    return parseYMD(head);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Monday `YYYY-MM-DD` for the calendar week containing this timesheet's `weekStart`. */
export function weekMondayISOFromDb(weekStart) {
  const d = parseDbDateToLocalDate(weekStart);
  if (!d) return "";
  return getWeekStartISO(d);
}

export const addDaysISO = (isoDate, days) => {
  const d = parseYMD(isoDate);
  d.setDate(d.getDate() + days);
  return toYMD(d);
};

export const getWeekStartISO = (date) => {
  let d;
  if (date instanceof Date) {
    d = new Date(date.getTime());
  } else if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date.slice(0, 10)) && !date.includes("T")) {
    d = parseYMD(date.slice(0, 10));
  } else {
    d = parseDbDateToLocalDate(date);
  }
  if (!d || Number.isNaN(d.getTime())) return "";
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return toYMD(d);
};

/** All day keys used in timesheet grids (Mon–Sun). */
export const TIMESHEET_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const calculateTotal = (weekData) =>
  TIMESHEET_DAY_KEYS.reduce((sum, key) => {
    const v = weekData?.[key];
    if (v === null || v === undefined || v === "") return sum;
    const n = Number(v);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);

/** Display cell: null / empty → em dash. */
export function formatHourCell(raw) {
  if (raw === null || raw === undefined || raw === "") return "—";
  const n = Number(raw);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(1);
}

/** Inclusive number of calendar days from start ISO to end ISO. */
export function daysInclusiveISO(startISO, endISO) {
  const a = parseYMD(startISO);
  const b = parseYMD(endISO);
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000)) + 1;
}

/**
 * Build Mon–Sun map for days in [periodStart, periodEnd]; all hours default to null (employee fills in).
 * Days outside the range are null.
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
      out[key] = null;
    } else {
      out[key] = null;
    }
  });
  return out;
}

/** `YYYY-MM-DD` from API DateTime / ISO / Date. */
export function toYmdFromAny(value) {
  const d = parseDbDateToLocalDate(value);
  if (!d) return "";
  return toYMD(d);
}

/** Range label: uses stored `periodStart`/`periodEnd` when set, else full Mon–Sun week of `weekStart`. */
export function formatTimesheetRangeLabel(sheet) {
  const ps = sheet.periodStart != null && sheet.periodStart !== "" ? toYmdFromAny(sheet.periodStart) : "";
  const pe = sheet.periodEnd != null && sheet.periodEnd !== "" ? toYmdFromAny(sheet.periodEnd) : "";
  if (ps && pe) {
    const start = parseYMD(ps);
    const end = parseYMD(pe);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const optsShort = { month: "short", day: "numeric" };
      const a = start.toLocaleDateString("en-US", optsShort);
      const b = end.toLocaleDateString("en-US", { ...optsShort, year: "numeric" });
      return `${a} – ${b}`;
    }
  }
  const weekMon = weekMondayISOFromDb(sheet.weekStart);
  if (!weekMon) return "—";
  const start = parseYMD(weekMon);
  const end = parseYMD(addDaysISO(weekMon, 6));
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const optsShort = { month: "short", day: "numeric" };
  const a = start.toLocaleDateString("en-US", optsShort);
  const b = end.toLocaleDateString("en-US", { ...optsShort, year: "numeric" });
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
