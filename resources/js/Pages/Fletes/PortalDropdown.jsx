import { createPortal } from 'react-dom'

export default function PortalDropdown({ isOpen, children, type }) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <div
        data-dropdown-type={type}
        className="absolute left-4 bg-white border rounded shadow-md z-50"
        style={{
          top: '130px',
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
