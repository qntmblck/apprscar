import { useEffect, useState } from 'react'

export default function WhatsAppChat() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      setShowChat(scrollBottom)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const phone = '56944671205'
  const handleSend = () => {
    const encoded = encodeURIComponent(message || 'Hola, quisiera más información')
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
  }

  return (
    <div className="fixed bottom-24 left-4 z-50">
      {showChat ? (
        <div
          onClick={handleSend}
          className="w-56 bg-white shadow-xl rounded-lg border border-gray-300 p-3 cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">
              WS
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">Transportes SCAR</p>
              <p className="text-[10px] text-gray-500">En línea</p>
            </div>
          </div>
          <div className="bg-gray-100 p-2 rounded-md text-xs text-gray-800 mb-2">
            Hola 👋 ¿En qué podemos ayudarte?
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs"
              placeholder="Escribe tu mensaje"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSend()
              }}
              className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md hover:bg-green-600"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12.01 2.002C6.481 2.002 2 6.483 2 12.013c0 2.108.55 4.076 1.51 5.793L2 22l4.331-1.406A9.927 9.927 0 0 0 12.01 22C17.54 22 22 17.519 22 12.001c0-5.53-4.459-9.999-9.99-9.999Zm0 18.001c-1.718 0-3.353-.462-4.763-1.265l-.34-.197-2.564.833.84-2.498-.22-.352A8.009 8.009 0 0 1 4 12.013C4 7.59 7.588 4 12.01 4c4.412 0 7.999 3.589 7.999 8.001 0 4.421-3.587 8.001-7.999 8.001Z" />
          </svg>
          WhatsApp
        </button>
      )}
    </div>
  )
}
