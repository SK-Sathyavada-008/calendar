import { Routes, Route, Navigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'

function App() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={`/calendar/${year}/${month}`} replace />}
      />
      <Route
        path="/calendar/:year/:month"
        element={<CalendarPage />}
      />
    </Routes>
  )
}

export default App