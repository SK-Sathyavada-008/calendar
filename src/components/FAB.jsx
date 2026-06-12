function FAB({ onClick }) {
  return (
    <button
      className="fab"
      onClick={onClick}
      aria-label="Add event"
    >
      +
    </button>
  )
}

export default FAB