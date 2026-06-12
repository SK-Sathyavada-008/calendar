import { useState, useEffect, useRef } from 'react'
import { getDaysInMonth } from '../utils/calendarHelpers'

const COLORS = [
  { label: 'Indigo',  value: '#4F46E5' },
  { label: 'Cyan',    value: '#0891B2' },
  { label: 'Green',   value: '#059669' },
  { label: 'Amber',   value: '#D97706' },
  { label: 'Red',     value: '#DC2626' },
  { label: 'Pink',    value: '#DB2777' },
  { label: 'Purple',  value: '#7C3AED' },
]

function AddEventDialog({ year, month, initialDay, onSave, onClose }) {
  const [title, setTitle] = useState('')
  const [day, setDay] = useState(initialDay || 1)
  const [color, setColor] = useState(COLORS[0].value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const inputRef = useRef(null)
  const totalDays = getDaysInMonth(year, month)

  // focus the title input when dialog opens
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  async function handleSave() {
    if (!title.trim()) {
      setError('Please enter an event title.')
      inputRef.current?.focus()
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave({ title, day: Number(day), color })
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // build day options for the selected month
  const dayOptions = []
  for (let d = 1; d <= totalDays; d++) {
    dayOptions.push(d)
  }

  return (
    <div
      className="dialog-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Add event"
    >
      <div className="dialog">

        {/* ── Header ── */}
        <div className="dialog-header">
          <h2 className="dialog-title">Add Event</h2>
          <button
            className="dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &#x2715;
          </button>
        </div>

        {/* ── Title input ── */}
        <div className="dialog-field">
          <label className="dialog-label" htmlFor="event-title">
            Event title
          </label>
          <input
            ref={inputRef}
            id="event-title"
            className={`dialog-input ${error ? 'dialog-input--error' : ''}`}
            type="text"
            placeholder="e.g. Team standup"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (error) setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
            }}
            maxLength={60}
          />
          {error && <p className="dialog-error">{error}</p>}
        </div>

        {/* ── Day picker ── */}
        <div className="dialog-field">
          <label className="dialog-label" htmlFor="event-day">
            Day
          </label>
          <select
            id="event-day"
            className="dialog-select"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* ── Color picker ── */}
        <div className="dialog-field">
          <span className="dialog-label">Color</span>
          <div className="color-swatches">
            {COLORS.map((c) => (
              <button
                key={c.value}
                className={`color-swatch ${color === c.value ? 'color-swatch--selected' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => setColor(c.value)}
                aria-label={c.label}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* ── Preview ── */}
        {title.trim() && (
          <div className="dialog-field">
            <span className="dialog-label">Preview</span>
            <div
              className="dialog-preview"
              style={{ backgroundColor: color }}
            >
              {title}
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="dialog-actions">
          <button
            className="btn btn--secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save event'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddEventDialog