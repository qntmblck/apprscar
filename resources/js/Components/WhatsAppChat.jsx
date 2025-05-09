import { useEffect, useState } from 'react'

export default function WhatsAppChat() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')

  // Detecta si el usuario llega al final de la página
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
    <div className="fixed bottom-6 right-6 z-50">
      {showChat ? (
        <div
          onClick={handleSend}
          className="w-72 bg-white shadow-xl rounded-xl border border-gray-300 p-4 cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              WS
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Transportes SCAR</p>
              <p className="text-xs text-gray-500">En línea</p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 mb-3">
            Hola 👋 ¿En qué podemos ayudarte?
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
              placeholder="Escribe tu mensaje"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSend()
              }}
              className="bg-green-500 text-white text-sm font-semibold px-3 py-1.5 rounded-md hover:bg-green-600"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleSend}
          className="bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2"
        >
          <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  className="w-5 h-5 text-white fill-current"
>
  <path d="M12.01 2.002C6.481 2.002 2 6.483 2 12.013c0 2.108.55 4.076 1.51 5.793L2 22l4.331-1.406A9.927 9.927 0 0 0 12.01 22C17.54 22 22 17.519 22 12.001c0-5.53-4.459-9.999-9.99-9.999Zm0 18.001c-1.718 0-3.353-.462-4.763-1.265l-.34-.197-2.564.833.84-2.498-.22-.352A8.009 8.009 0 0 1 4 12.013C4 7.59 7.588 4 12.01 4c4.412 0 7.999 3.589 7.999 8.001 0 4.421-3.587 8.001-7.999 8.001Zm4.463-5.635c-.246-.123-1.453-.717-1.679-.799-.226-.083-.39-.123-.555.123-.164.246-.635.799-.779.964-.143.164-.287.184-.533.061-.246-.122-1.037-.382-1.976-1.218-.73-.651-1.223-1.456-1.365-1.703-.143-.246-.015-.378.107-.5.11-.11.246-.287.369-.43.123-.143.164-.246.246-.41.082-.164.041-.308-.02-.43-.061-.123-.555-1.34-.76-1.834-.2-.48-.403-.413-.555-.421-.143-.007-.308-.009-.473-.009a.909.909 0 0 0-.664.308c-.226.246-.86.84-.86 2.048 0 1.208.881 2.376 1.003 2.541.123.164 1.733 2.645 4.2 3.715.588.254 1.046.405 1.403.518.59.187 1.128.161 1.552.098.474-.07 1.453-.594 1.657-1.167.204-.572.204-1.062.143-1.167-.061-.106-.225-.164-.472-.287Z" />
</svg>

          WhatsApp
        </button>
      )}
    </div>
  )
}
