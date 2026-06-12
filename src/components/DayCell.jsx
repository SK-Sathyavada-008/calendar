import { memo } from "react"
import { isToday } from "../utils/calendarHelpers"
import { getHoliday } from "../utils/holidays"
import EventBadge from "./EventBadge"

function DayCell({ day, year, month, events, onClick }) {
  if (!day) {
    return <div className="day-cell day-cell--empty" />
  }

  const today = isToday(year, month, day)
  const holiday = getHoliday(month, day)
  const visibleEvents = events.slice(0, 2)  // reduced to 2 to make room for holiday
  const overflowCount = events.length - visibleEvents.length

  return (
    <div
      className={`day-cell ${today ? "day-cell--today" : ""}`}
      onClick={onClick}
      role="gridcell"
      aria-label={`${year}-${month}-${day}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick()
      }}
    >
      <span className={`day-number ${today ? "day-number--today" : ""}`}>
        {day}
      </span>

      {/* ── Holiday badge ── */}
      {holiday && (
        <div
          className={`holiday-badge holiday-badge--${holiday.type}`}
          title={holiday.name}
        >
          {holiday.type === "festival" ? "🪔" : "🕉️"} {holiday.name}
        </div>
      )}

      {/* ── User events ── */}
      <div className="day-events">
        {visibleEvents.map((event) => (
          <EventBadge key={event.id} event={event} />
        ))}
        {overflowCount > 0 && (
          <span className="day-overflow">+{overflowCount} more</span>
        )}
      </div>
    </div>
  )
}

export default memo(DayCell)