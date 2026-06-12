import { useState, useEffect, useCallback } from 'react'
import { buildDateString } from '../utils/calendarHelpers'

function getStorageKey(year, month) {
  return `events-${year}-${String(month).padStart(2, '0')}`
}

function fakeDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function useEvents(year, month) {
  const [events, setEvents] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      setLoading(true)
      setEvents({})

      await fakeDelay(400)

      if (cancelled) return

      const key = getStorageKey(year, month)
      const stored = localStorage.getItem(key)

      if (stored) {
        try {
          setEvents(JSON.parse(stored))
        } catch {
          setEvents({})
        }
      } else {
        setEvents({})
      }

      setLoading(false)
    }

    loadEvents()

    return () => {
      cancelled = true
    }
  }, [year, month])

  const addEvent = useCallback(
    async ({ title, day, color }) => {
      await fakeDelay(300)

      const dateStr = buildDateString(year, month, day)

      const newEvent = {
        id: generateId(),
        title: title.trim(),
        date: dateStr,
        color: color || '#4F46E5',
      }

      setEvents((prev) => {
        const existing = prev[dateStr] || []
        const updated = {
          ...prev,
          [dateStr]: [...existing, newEvent],
        }

        const key = getStorageKey(year, month)
        localStorage.setItem(key, JSON.stringify(updated))

        return updated
      })

      return newEvent
    },
    [year, month]
  )

  const deleteEvent = useCallback(
    (dateStr, eventId) => {
      setEvents((prev) => {
        const existing = prev[dateStr] || []
        const updated = {
          ...prev,
          [dateStr]: existing.filter((e) => e.id !== eventId),
        }

        if (updated[dateStr].length === 0) {
          delete updated[dateStr]
        }

        const key = getStorageKey(year, month)
        localStorage.setItem(key, JSON.stringify(updated))

        return updated
      })
    },
    [year, month]
  )

  return { events, loading, addEvent, deleteEvent }
}

export default useEvents