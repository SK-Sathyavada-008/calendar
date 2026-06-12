import { useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MonthYearSelector from "../components/MonthYearSelector"
import CalendarGrid from "../components/CalendarGrid"
import AddEventDialog from "../components/AddEventDialog"
import FAB from "../components/FAB"
import { formatMonthYear, prevMonth, nextMonth } from "../utils/calendarHelpers"
import { getHolidaysForMonth } from "../utils/holidays"
import useEvents from "../hooks/useEvents"
import useNotes from "../hooks/useNotes"

function CalendarPage() {
  const { year, month } = useParams()
  const navigate = useNavigate()

  const y = Number(year)
  const m = Number(month)

  const { events, loading, addEvent } = useEvents(y, m)
  const { notes, addNote, deleteNote } = useNotes(y, m)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)

  // Notes input state
  const [noteInputOpen, setNoteInputOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const noteInputRef = useRef(null)

  const holidaysThisMonth = getHolidaysForMonth(m)

  // All user-added events for the month as a flat list (for the card)
  const eventsThisMonth = Object.entries(events)
    .flatMap(([dateStr, evArr]) =>
      evArr.map((ev) => ({ ...ev, dateStr }))
    )
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr))

  function handlePrev() {
    const { year: py, month: pm } = prevMonth(y, m)
    navigate(`/calendar/${py}/${pm}`)
  }

  function handleNext() {
    const { year: ny, month: nm } = nextMonth(y, m)
    navigate(`/calendar/${ny}/${nm}`)
  }

  const handleDayClick = useCallback((day) => {
    setSelectedDay(day)
    setDialogOpen(true)
  }, [])

  const handleFABClick = useCallback(() => {
    setSelectedDay(new Date().getDate())
    setDialogOpen(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    setSelectedDay(null)
  }, [])

  const handleEventSave = useCallback(
    async ({ title, day, color }) => {
      await addEvent({ title, day, color })
      handleDialogClose()
    },
    [addEvent, handleDialogClose]
  )

  function handleNoteAdd() {
    if (!noteText.trim()) return
    addNote(noteText)
    setNoteText("")
    setNoteInputOpen(false)
  }

  function handleNoteInputOpen() {
    setNoteInputOpen(true)
    // focus after render
    setTimeout(() => noteInputRef.current?.focus(), 50)
  }

  return (
    <div className="page-wrapper">

      {/* ── Top bar ── */}
      <div className="topbar">
        <button className="nav-btn" onClick={handlePrev} aria-label="Previous month">
          &#8249;
        </button>
        <div className="topbar-center">
          <h1 className="month-title">{formatMonthYear(y, m)}</h1>
          <MonthYearSelector year={y} month={m} />
        </div>
        <button className="nav-btn" onClick={handleNext} aria-label="Next month">
          &#8250;
        </button>
      </div>

      {/* ── Loading bar ── */}
      {loading && (
        <div className="loading-bar">
          <div className="loading-bar-inner" />
        </div>
      )}

      {/* ── Calendar grid ── */}
      <div className={loading ? "grid-faded" : ""}>
        <CalendarGrid
          year={y}
          month={m}
          events={events}
          onDayClick={handleDayClick}
        />
      </div>

      {/* ── Bottom cards ── */}
      <div className="bottom-cards">

        {/* ── Card 1: Holidays & Events ── */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon">🗓️</span>
            <h2 className="info-card-title">Holidays & Events</h2>
            <span className="info-card-count">
              {holidaysThisMonth.length + eventsThisMonth.length}
            </span>
          </div>

          <div className="info-card-body">
            {holidaysThisMonth.length === 0 && eventsThisMonth.length === 0 && (
              <p className="info-card-empty">No holidays or events this month.</p>
            )}

            {/* Holidays */}
            {holidaysThisMonth.map((h) => (
              <div key={`${h.day}-${h.name}`} className="info-card-row">
                <span className="info-card-day">{h.day}</span>
                <span
                  className={`info-card-dot info-card-dot--${h.type}`}
                />
                <span className="info-card-name">{h.name}</span>
                <span className="info-card-tag info-card-tag--holiday">
                  {h.type === "festival" ? "Festival" : "Ekadashi"}
                </span>
              </div>
            ))}

            {/* User-added events */}
            {eventsThisMonth.map((ev) => (
              <div key={ev.id} className="info-card-row">
                <span className="info-card-day">
                  {parseInt(ev.dateStr.split("-")[2])}
                </span>
                <span
                  className="info-card-dot"
                  style={{ backgroundColor: ev.color }}
                />
                <span className="info-card-name">{ev.title}</span>
                <span className="info-card-tag info-card-tag--event">
                  Event
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card 2: Monthly Notes ── */}
        <div className="info-card">
          <div className="info-card-header">
            <span className="info-card-icon">📝</span>
            <h2 className="info-card-title">Monthly Notes</h2>
            <button
              className="note-add-btn"
              onClick={handleNoteInputOpen}
              aria-label="Add note"
              title="Add a note"
            >
              +
            </button>
          </div>

          {/* Note input area */}
          {noteInputOpen && (
            <div className="note-input-area">
              <textarea
                ref={noteInputRef}
                className="note-textarea"
                placeholder="Write your note for this month..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleNoteAdd()
                  if (e.key === "Escape") {
                    setNoteInputOpen(false)
                    setNoteText("")
                  }
                }}
                rows={3}
              />
              <div className="note-input-actions">
                <span className="note-input-hint">Ctrl+Enter to save · Esc to cancel</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn--secondary"
                    onClick={() => { setNoteInputOpen(false); setNoteText("") }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn--primary"
                    onClick={handleNoteAdd}
                    disabled={!noteText.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="info-card-body">
            {notes.length === 0 && !noteInputOpen && (
              <p className="info-card-empty">
                No notes yet. Click + to add a note for {formatMonthYear(y, m)}.
              </p>
            )}

            {notes.map((note) => (
              <div key={note.id} className="note-row">
                <p className="note-text">{note.text}</p>
                <button
                  className="note-delete-btn"
                  onClick={() => deleteNote(note.id)}
                  aria-label="Delete note"
                  title="Delete"
                >
                  &#x2715;
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── FAB ── */}
      <FAB onClick={handleFABClick} />

      {/* ── Add event dialog ── */}
      {dialogOpen && (
        <AddEventDialog
          year={y}
          month={m}
          initialDay={selectedDay}
          onSave={handleEventSave}
          onClose={handleDialogClose}
        />
      )}

    </div>
  )
}

export default CalendarPage