function hexToRgb(hex) {
  const normalized = hex.replace('#', '')

  if (normalized.length !== 6) return '0, 148, 217'

  const value = Number.parseInt(normalized, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255

  return `${r}, ${g}, ${b}`
}

export default function SectionBadge({
  children,
  color = '#0094d9',
  className = '',
}) {
  const rgb = hexToRgb(color)

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${className}`}
      style={{
        color,
        backgroundColor: `rgba(${rgb}, 0.10)`,
        borderColor: `rgba(${rgb}, 0.24)`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full animate-pulse"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 14px rgba(${rgb}, 0.55)`,
        }}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
