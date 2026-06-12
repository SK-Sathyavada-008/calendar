import { useState, useEffect, useCallback } from "react"

function getNoteKey(year, month) {
  return `notes-${year}-${String(month).padStart(2, "0")}`
}

function useNotes(year, month) {
  const [notes, setNotes] = useState([])

  // Load notes for this month from localStorage
  useEffect(() => {
    const key = getNoteKey(year, month)
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        setNotes(JSON.parse(stored))
      } catch {
        setNotes([])
      }
    } else {
      setNotes([])
    }
  }, [year, month])

  const addNote = useCallback(
    (text) => {
      const newNote = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      }
      setNotes((prev) => {
        const updated = [...prev, newNote]
        localStorage.setItem(getNoteKey(year, month), JSON.stringify(updated))
        return updated
      })
    },
    [year, month]
  )

  const deleteNote = useCallback(
    (id) => {
      setNotes((prev) => {
        const updated = prev.filter((n) => n.id !== id)
        localStorage.setItem(getNoteKey(year, month), JSON.stringify(updated))
        return updated
      })
    },
    [year, month]
  )

  return { notes, addNote, deleteNote }
}

export default useNotes