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

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Human label for a Mon–Sun (or partial) range, e.g. "Apr 15 (Mon) – Apr 20 (Sat), 2026". */
export function formatWeekRangeWithWeekdays(periodStartISO, periodEndISO) {
  if (periodStartISO == null || periodEndISO == null || periodStartISO === "" || periodEndISO === "") return "—";
  const a = parseYMD(periodStartISO);
  const b = parseYMD(periodEndISO);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return "—";
  const y = b.getFullYear();
  const sameYear = a.getFullYear() === y;
  const startPart = `${a.toLocaleDateString("en-US", { month: "short", day: "numeric" })} (${WEEKDAY_SHORT[a.getDay()]})`;
  const endPart = `${b.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  })} (${WEEKDAY_SHORT[b.getDay()]})${sameYear ? `, ${y}` : ""}`;
  return `${startPart} – ${endPart}`;
}

/** Title line: "Week of Apr 20 – Apr 26, 2026" (calendar Monday–Sunday). */
export function formatWeekOfCalendarRange(mondayISO, sundayISO) {
  if (!mondayISO || !sundayISO) return "—";
  const a = parseYMD(mondayISO);
  const b = parseYMD(sundayISO);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return "—";
  const opts = { month: "short", day: "numeric" };
  const y = a.getFullYear();
  const sameYear = b.getFullYear() === y;
  const left = a.toLocaleDateString("en-US", opts);
  const right = b.toLocaleDateString("en-US", { ...opts, ...(sameYear ? {} : { year: "numeric" }) });
  return `Week of ${left} – ${right}${sameYear ? `, ${y}` : ""}`;
}

/**
 * Submission window for a chosen week: full Mon–Sun, except current calendar week uses end = min(Sunday, today).
 */
export function getPickerWeekBounds(mondayISO, today = new Date()) {
  if (!mondayISO || !/^\d{4}-\d{2}-\d{2}$/.test(mondayISO)) return null;
  const todayStr = toYMD(today);
  const currentMonday = getWeekStartISO(today);
  if (!currentMonday) return null;
  const sunISO = addDaysISO(mondayISO, 6);
  const isCurrentWeek = mondayISO === currentMonday;
  const periodEnd = isCurrentWeek && sunISO > todayStr ? todayStr : sunISO;
  if (periodEnd < mondayISO) return null;
  return { mondayISO, periodStart: mondayISO, periodEnd, sunISO };
}

/**
 * Weeks for "new timesheet" picker: current week through past weeks (no future weeks).
 * Skips weeks that already have a timesheet (`weekStart` anchors).
 * For the calendar week containing `today`, `periodEnd` is min(Sunday, today) so submissions never end in the future.
 */
export function buildSelectableWeekOptions(timesheets, today = new Date(), maxWeeksBack = 104) {
  try {
    if (!today || Number.isNaN(new Date(today).getTime())) return [];
    const taken = new Set(
      (Array.isArray(timesheets) ? timesheets : []).map((t) => weekMondayISOFromDb(t.weekStart)).filter(Boolean),
    );
    const todayStr = toYMD(today);
    const currentMonday = getWeekStartISO(today);
    if (!currentMonday) return [];
    const options = [];
    const mon = parseYMD(currentMonday);
    if (Number.isNaN(mon.getTime())) return [];
    for (let i = 0; i < maxWeeksBack; i++) {
      const monISO = toYMD(mon);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(monISO)) break;
      const sunISO = addDaysISO(monISO, 6);
      const isCurrentWeek = monISO === currentMonday;
      const periodEnd = isCurrentWeek && sunISO > todayStr ? todayStr : sunISO;
      if (periodEnd < monISO) break;
      if (!taken.has(monISO)) {
        const start = parseYMD(monISO);
        const end = parseYMD(periodEnd);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) break;
        const sameYear = start.getFullYear() === end.getFullYear();
        const labelCore = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          ...(sameYear ? {} : { year: "numeric" }),
        })}${sameYear ? `, ${start.getFullYear()}` : ""}`;
        options.push({
          mondayISO: monISO,
          periodStart: monISO,
          periodEnd,
          label: `Week of ${labelCore}`,
        });
      }
      mon.setDate(mon.getDate() - 7);
      if (Number.isNaN(mon.getTime())) break;
    }
    return options;
  } catch {
    return [];
  }
}
