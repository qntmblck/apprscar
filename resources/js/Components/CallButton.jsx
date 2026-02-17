export default function CallButton() {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <a
          href="tel:+56944671205"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-700 transition text-sm"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79a15.91 15.91 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 12.36 12.36 0 004.35.83 1 1 0 011 1v3.7a1 1 0 01-1 1A17.91 17.91 0 012 4a1 1 0 011-1h3.71a1 1 0 011 1 12.36 12.36 0 00.83 4.35 1 1 0 01-.25 1.05l-2.2 2.2z" />
          </svg>

        </a>
      </div>
    )
  }
