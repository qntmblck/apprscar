// resources/js/Components/PortalDropdown.jsx
import { createPortal } from 'react-dom'
import React from 'react'

export default function PortalDropdown({ isOpen, children, type }) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-start items-start p-4 pointer-events-none">
      <div data-dropdown-type={type} className="pointer-events-auto">
        {children}
      </div>
    </div>,
    document.body
  )
}
