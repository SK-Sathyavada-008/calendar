import { getDaysInMonth as dateFnsGetDays, getDay, format } from 'date-fns'

export function getDaysInMonth(year, month) {
  return dateFnsGetDays(new Date(year, month - 1, 1))
}

export function getFirstWeekday(year, month) {
  return getDay(new Date(year, month - 1, 1))
}

export function buildCalendarGrid(year, month) {
  const totalDays = getDaysInMonth(year, month)
  const startOffset = getFirstWeekday(year, month)
  const totalSlots = Math.ceil((totalDays + startOffset) / 7) * 7
  const grid = []

  for (let i = 0; i < totalSlots; i++) {
    const dayNumber = i - startOffset + 1
    if (dayNumber < 1 || dayNumber > totalDays) {
      grid.push(null)
    } else {
      grid.push(dayNumber)
    }
  }

  return grid
}

export function formatMonthYear(year, month) {
  return format(new Date(year, month - 1, 1), 'MMMM yyyy')
}

export function buildDateString(year, month, day) {
  const mm = String(month).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function isToday(year, month, day) {
  const today = new Date()
  return (
    today.getFullYear() === Number(year) &&
    today.getMonth() + 1 === Number(month) &&
    today.getDate() === day
  )
}

export function getTodayString() {
  const today = new Date()
  return buildDateString(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  )
}

export function prevMonth(year, month) {
  const y = Number(year)
  const m = Number(month)
  return m === 1
    ? { year: y - 1, month: 12 }
    : { year: y, month: m - 1 }
}

export function nextMonth(year, month) {
  const y = Number(year)
  const m = Number(month)
  return m === 12
    ? { year: y + 1, month: 1 }
    : { year: y, month: m + 1 }
}