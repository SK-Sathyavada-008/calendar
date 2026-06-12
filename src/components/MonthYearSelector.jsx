import { useNavigate } from 'react-router-dom'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

function MonthYearSelector({ year, month }) {
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear - 10; y <= currentYear + 10; y++) {
    years.push(y)
  }

  function handleMonthChange(e) {
    navigate(`/calendar/${year}/${e.target.value}`)
  }

  function handleYearChange(e) {
    navigate(`/calendar/${e.target.value}/${month}`)
  }

  return (
    <div className="selector-row">
      <select
        className="selector-select"
        value={month}
        onChange={handleMonthChange}
        aria-label="Select month"
      >
        {MONTHS.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        className="selector-select"
        value={year}
        onChange={handleYearChange}
        aria-label="Select year"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

export default MonthYearSelector