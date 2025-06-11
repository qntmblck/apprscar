import { createPortal } from 'react-dom'

function PortalDropdown({ isOpen, children }) {
  if (!isOpen) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-start items-start p-4 pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>,
    document.body
  )
}
