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

export const calculateTotal = (weekData) =>
  ["mon", "tue", "wed", "thu", "fri"].reduce((sum, key) => sum + Number(weekData[key] || 0), 0);

export function weekDayRows(weekStartISO) {
  const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const keys = ["mon", "tue", "wed", "thu", "fri"];
  const mon = parseYMD(weekStartISO);
  return keys.map((key, i) => {
    const d = new Date(mon);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { key, label: labels[i], dateStr };
  });
}
