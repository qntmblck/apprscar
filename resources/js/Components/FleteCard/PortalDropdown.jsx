// resources/js/Components/FleteCard/PortalDropdown.jsx
import React from 'react'
import { createPortal } from 'react-dom'

export default function PortalDropdown({ isOpen, children, type }) {
  if (!isOpen) return null

  const isCalendar = type === 'Salida' || type === 'Llegada'

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-start items-start p-4 pointer-events-none">
      <div
        data-dropdown-type={type}
        className={
          'pointer-events-auto rounded bg-white shadow-md ' +
          (isCalendar
            ? 'overflow-visible'            // fuerza que el contenido se expanda
            : 'max-h-48 overflow-auto')     // scroll tras 4 ítems para los demás
        }
        style={isCalendar ? { overflow: 'visible' } : {}}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
