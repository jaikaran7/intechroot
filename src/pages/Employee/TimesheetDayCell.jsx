import { TIMESHEET_DAY_STATUS, formatHourCell, parseDayState, sanitizeHourInput } from "./timesheetUtils";

const PILLS = [
  { status: TIMESHEET_DAY_STATUS.WORKING, label: "W", title: "Work" },
  { status: TIMESHEET_DAY_STATUS.OFF, label: "O", title: "Off" },
  { status: TIMESHEET_DAY_STATUS.LEAVE, label: "L", title: "Leave" },
];

const HOUR_PRESETS = [4, 6, 8, 8.5];

function pillActiveClass(status) {
  if (status === TIMESHEET_DAY_STATUS.WORKING) {
    return "bg-[#2563eb] text-white shadow-md";
  }
  if (status === TIMESHEET_DAY_STATUS.OFF) {
    return "bg-slate-500 text-white shadow-md";
  }
  return "bg-amber-500 text-white shadow-md";
}

function shellBorderForStatus(status) {
  if (status === TIMESHEET_DAY_STATUS.WORKING) return "border-slate-200/80 bg-white shadow-sm";
  if (status === TIMESHEET_DAY_STATUS.OFF) return "border-slate-200/70 bg-slate-50/90 shadow-sm";
  return "border-amber-200/60 bg-amber-50/40 shadow-sm";
}

/**
 * Column header (MON / 04) sits above the card; minimal empty hours (no placeholder).
 */
export default function TimesheetDayCell({
  dayKey,
  /** @deprecated use columnDayName when showing calendar header */
  dayLabel,
  columnDayName,
  columnDateNum,
  showDayLabel = true,
  showHourPresets = true,
  isEditing,
  cellValue,
  onStatusChange,
  onHoursChange,
}) {
  const state = parseDayState(cellValue, dayKey);
  const hasColumnHeader = columnDayName != null && columnDateNum != null;

  const ensureWork = (e) => {
    e.stopPropagation();
    if (state.status !== TIMESHEET_DAY_STATUS.WORKING) {
      onStatusChange(TIMESHEET_DAY_STATUS.WORKING);
    }
  };

  const hoursShown = formatHourCell(cellValue);
  const hasWorkHours =
    state.status === TIMESHEET_DAY_STATUS.WORKING &&
    cellValue != null &&
    String(cellValue).trim() !== "" &&
    hoursShown !== "—";

  const readOnlyBody = !isEditing ? (
    <div
      className={`flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 transition-colors md:min-h-[4.25rem] md:px-2.5 md:py-2.5 lg:min-h-[4.75rem] lg:px-3 ${shellBorderForStatus(state.status)}`}
    >
      {!hasColumnHeader && showDayLabel && dayLabel ? (
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{dayLabel}</span>
      ) : null}
      {state.status === TIMESHEET_DAY_STATUS.WORKING ? (
        <span
          className={`text-sm font-semibold tabular-nums leading-none md:text-base lg:text-lg ${
            hasWorkHours ? "text-[#1d4ed8]" : "text-slate-300"
          }`}
        >
          {hoursShown}
          {hasWorkHours ? (
            <span className="ml-0.5 text-[10px] font-medium text-slate-400 md:text-xs">h</span>
          ) : null}
        </span>
      ) : state.status === TIMESHEET_DAY_STATUS.OFF ? (
        <span className="text-[10px] font-semibold text-slate-600 md:text-[11px]">Off</span>
      ) : (
        <span className="text-[10px] font-semibold text-amber-900 md:text-[11px]">Lv</span>
      )}
    </div>
  ) : (
    <div
      className={`flex flex-col items-stretch gap-1.5 rounded-xl border px-2 py-2 transition-all duration-150 md:gap-2 md:px-2.5 md:py-2.5 lg:px-3 ${shellBorderForStatus(state.status)}`}
    >
      {!hasColumnHeader && showDayLabel && dayLabel ? (
        <span className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">{dayLabel}</span>
      ) : null}

      <div
        className="mx-auto flex w-full max-w-[5.25rem] rounded-lg bg-slate-100/90 p-0.5 ring-1 ring-slate-200/50 md:max-w-[5.75rem] md:p-1 lg:max-w-[6.75rem]"
        role="group"
        aria-label={`${dayKey} status`}
      >
        {PILLS.map((p) => {
          const active = state.status === p.status;
          return (
            <button
              key={p.status}
              type="button"
              title={p.title}
              className={`min-h-9 min-w-0 flex-1 touch-manipulation rounded-md text-[11px] font-extrabold transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:ring-offset-1 md:min-h-10 md:text-xs lg:min-h-11 lg:text-sm ${
                active ? pillActiveClass(p.status) : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(p.status);
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-[1.35rem] flex-col items-center justify-center gap-1 md:min-h-7">
        {state.status === TIMESHEET_DAY_STATUS.WORKING ? (
          <>
            <div
              className="flex cursor-text items-baseline justify-center gap-0.5 px-0.5"
              onClick={ensureWork}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <input
                className="min-w-[2.5rem] max-w-[5rem] border-0 border-b border-slate-300/90 bg-transparent text-center text-sm font-semibold tabular-nums text-[#1e40af] outline-none transition focus-visible:border-blue-500 md:min-w-[2.75rem] md:text-base lg:text-lg"
                inputMode="decimal"
                aria-label={`${dayKey} hours`}
                autoComplete="off"
                type="text"
                value={state.hours}
                onClick={(e) => {
                  e.stopPropagation();
                  ensureWork(e);
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  onHoursChange(e.target.value);
                }}
                onBlur={(e) => {
                  e.stopPropagation();
                  onHoursChange(sanitizeHourInput(e.target.value));
                }}
              />
              {state.hours.trim() !== "" ? (
                <span className="text-[10px] font-medium tabular-nums text-slate-400 md:text-xs">h</span>
              ) : null}
            </div>
            {showHourPresets ? (
              <div className="flex flex-wrap justify-center gap-1 leading-none">
                {HOUR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="min-h-[26px] min-w-[1.75rem] touch-manipulation rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-900 sm:text-[10px] md:min-h-7 md:px-2"
                    title={`${preset} h`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onHoursChange(String(preset));
                    }}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : state.status === TIMESHEET_DAY_STATUS.OFF ? (
          <span className="text-[10px] font-medium text-slate-500 md:text-[11px]">Off</span>
        ) : (
          <span className="text-[10px] font-medium text-amber-900/85 md:text-[11px]">Leave</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-w-0 flex-col items-stretch gap-1.5 md:gap-2">
      {hasColumnHeader ? (
        <div className="flex flex-col items-center gap-0.5 text-center leading-tight">
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400 md:text-[10px]">
            {columnDayName}
          </span>
          <span className="text-[13px] font-semibold tabular-nums text-slate-800 md:text-sm lg:text-[15px]">
            {columnDateNum}
          </span>
        </div>
      ) : null}
      {readOnlyBody}
    </div>
  );
}
