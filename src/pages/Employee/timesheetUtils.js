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
export const TIMESHEET_DAY_STATUS = {
  WORKING: "WORKING",
  OFF: "OFF",
  LEAVE: "LEAVE",
};

const WEEKDAY_COLUMN_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

/** Day name + calendar date (`MON` / `04`) for headers above each timesheet column. */
export function weekCalendarDayMeta(weekStartDb, dayKey) {
  const idx = TIMESHEET_DAY_KEYS.indexOf(dayKey);
  if (idx < 0) return { dayName: "—", dateNum: "—" };
  const dayName = WEEKDAY_COLUMN_LABELS[idx];
  const mon = weekMondayISOFromDb(weekStartDb);
  if (!mon) return { dayName, dateNum: "—" };
  const iso = addDaysISO(mon, idx);
  const d = parseYMD(iso);
  if (Number.isNaN(d.getTime())) return { dayName, dateNum: "—" };
  const dateNum = String(d.getDate()).padStart(2, "0");
  return { dayName, dateNum };
}

export const calculateTotal = (weekData) =>
  TIMESHEET_DAY_KEYS.reduce((sum, key) => {
    const v = weekData?.[key];
    if (v === null || v === undefined || v === "") return sum;
    if (v === "L" || v === "O" || v === "LEAVE" || v === "OFF") return sum;
    const n = Number(v);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);

/** Display cell: null / empty → em dash; L/O leave-off markers as-is. */
export function formatHourCell(raw) {
  if (raw === null || raw === undefined || raw === "") return "—";
  if (raw === "L" || raw === "LEAVE") return "LEAVE";
  if (raw === "O" || raw === "OFF") return "OFF";
  const n = Number(raw);
  if (Number.isNaN(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  if (rounded === Math.floor(rounded)) return `${rounded}.0`;
  return String(rounded).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}

export function isWeekendKey(dayKey) {
  return dayKey === "sat" || dayKey === "sun";
}

export function parseDayState(raw, dayKey) {
  const v = raw == null ? "" : String(raw).trim();
  const upper = v.toUpperCase();
  if (upper === "O" || upper === "OFF") return { status: TIMESHEET_DAY_STATUS.OFF, hours: "" };
  if (upper === "L" || upper === "LEAVE") return { status: TIMESHEET_DAY_STATUS.LEAVE, hours: "" };
  if (v === "") {
    return { status: TIMESHEET_DAY_STATUS.WORKING, hours: "" };
  }
  // Preserve in-progress decimals ("5.", "0.") for controlled input — do not coerce via Number() yet.
  if (/^\d+\.$/.test(v) || v === "0.") {
    return { status: TIMESHEET_DAY_STATUS.WORKING, hours: v };
  }
  const n = Number(v);
  if (Number.isNaN(n)) return { status: TIMESHEET_DAY_STATUS.WORKING, hours: "" };
  const clamped = Math.min(24, Math.max(0, n));
  const rounded = Math.round(clamped * 1e6) / 1e6;
  return { status: TIMESHEET_DAY_STATUS.WORKING, hours: formatHoursStringForState(rounded, v) };
}

/** Keep user-typed decimals stable when possible (avoid float artifacts). */
function formatHoursStringForState(rounded, originalRaw) {
  const o = String(originalRaw ?? "").trim();
  if (/\d+\.\d+/.test(o) && Math.abs(Number(o) - rounded) < 1e-9) return o;
  if (rounded === Math.floor(rounded)) return String(Math.floor(rounded));
  return String(rounded);
}

/**
 * Sanitize hours while typing: one decimal point, digits only, max 24h, preserve trailing ".".
 */
export function sanitizeHourInput(raw) {
  let s = String(raw ?? "").replace(/[^\d.]/g, "");
  if (!s) return "";

  const fd = s.indexOf(".");
  if (fd !== -1) {
    s = s.slice(0, fd + 1) + s.slice(fd + 1).replace(/\./g, "");
  }
  if (s === ".") return "0.";
  if (s.startsWith(".")) s = "0" + s;

  const d = s.indexOf(".");
  if (d === -1) {
    if (!/^\d+$/.test(s)) return "";
    const n = Number(s);
    if (Number.isNaN(n)) return "";
    if (n > 24) return "24";
    if (n < 0) return "0";
    return String(parseInt(s, 10));
  }

  let intPart = s.slice(0, d);
  const afterDot = s.slice(d + 1);
  const trailingDot = afterDot === "";
  const decPart = trailingDot ? "" : afterDot.replace(/[^\d]/g, "").slice(0, 8);

  intPart = intPart === "" ? "0" : String(parseInt(intPart, 10));
  const intNum = Number(intPart);
  if (intNum > 24) return "24";
  if (intNum === 24 && (decPart.length > 0 || trailingDot)) return "24";

  if (trailingDot) return `${intPart}.`;
  if (decPart === "") return intPart;

  const out = `${intPart}.${decPart}`;
  const n = Number(out);
  if (Number.isNaN(n)) return out;
  if (n > 24) return "24";
  if (n < 0) return "0";
  return out;
}

export function composeDayValue(status, hoursInput) {
  if (status === TIMESHEET_DAY_STATUS.OFF) return "O";
  if (status === TIMESHEET_DAY_STATUS.LEAVE) return "L";
  const t = String(hoursInput ?? "").trim();
  if (t === "") return null;
  const n = Number(t);
  if (Number.isNaN(n)) return null;
  const clamped = Math.min(24, Math.max(0, n));
  return Math.round(clamped * 1e6) / 1e6;
}

/** While typing: allow digits/one dot, or a single L/l/O/o. */
export function sanitizeTimesheetDayInput(raw) {
  const t = String(raw ?? "");
  if (t === "") return "";
  const trimmed = t.trim();
  if (trimmed.length === 1 && /^[lLoO]$/i.test(trimmed)) return trimmed.toUpperCase();
  return trimmed.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
}

/** Value sent to API: hours 0–24, "L" (leave), "O" (off), or null. */
export function normalizeTimesheetCellForPayload(raw) {
  const t = String(raw ?? "").trim();
  if (t === "") return null;
  const u = t.toUpperCase();
  if (u === "L" || u === "LEAVE") return "L";
  if (u === "O" || u === "OFF") return "O";
  const n = Number(t);
  if (Number.isNaN(n)) return null;
  const clamped = Math.min(24, Math.max(0, n));
  return Math.round(clamped * 1e6) / 1e6;
}

export function weekDataPayloadFromInput(input) {
  const o = {};
  TIMESHEET_DAY_KEYS.forEach((k) => {
    o[k] = normalizeTimesheetCellForPayload(input[k]);
  });
  return o;
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
      out[key] = isWeekendKey(key) ? "O" : null;
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
