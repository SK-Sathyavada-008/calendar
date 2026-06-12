import { memo } from 'react'
import { buildCalendarGrid } from '../utils/calendarHelpers'
import DayCell from './DayCell'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function CalendarGrid({ year, month, events, onDayClick }) {
  const grid = buildCalendarGrid(year, month)

  return (
    <div className="calendar-wrapper">
      <div className="calendar-grid">

        {/* ── Weekday headers ── */}
        {WEEKDAYS.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}

        {/* ── Day cells ── */}
        {grid.map((dayNumber, index) => (
          <DayCell
            key={index}
            day={dayNumber}
            year={year}
            month={month}
            events={
              dayNumber
                ? (events[`${year}-${String(month).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`] || [])
                : []
            }
            onClick={() => dayNumber && onDayClick(dayNumber)}
          />
        ))}

      </div>
    </div>
  )
}

export default memo(CalendarGrid)