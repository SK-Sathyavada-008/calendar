function EventBadge({ event }) {
  return (
    <div
      className="event-badge"
      style={{ backgroundColor: event.color || '#4F46E5' }}
      title={event.title}
    >
      <span className="event-badge-title">{event.title}</span>
    </div>
  )
}

export default EventBadge