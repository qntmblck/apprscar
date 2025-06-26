import { useEffect, useState } from 'react'

export default function WhatsAppChat() {
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
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
    <div className="fixed bottom-4 right-4 z-50">
      {showChat ? (
        <div
          onClick={handleSend}
          className="w-60 bg-white shadow-xl rounded-lg border border-gray-300 p-4 cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                className="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.003 2.001C8.823 2.001 3 7.825 3 15.004a12.99 12.99 0 0 0 1.804 6.638L3 29l7.576-2.41A12.975 12.975 0 0 0 16.003 28C23.181 28 29 22.177 29 15.004c0-7.18-5.819-13.003-12.997-13.003Zm-.03 23.03a10.96 10.96 0 0 1-5.66-1.565l-.404-.242-4.491 1.43 1.46-4.374-.263-.45a10.97 10.97 0 0 1-1.643-5.789c0-6.05 4.924-10.974 10.974-10.974 6.05 0 10.974 4.924 10.974 10.974S21.993 25.03 15.974 25.03Zm6.284-7.637c-.346-.173-2.053-1.01-2.37-1.125-.316-.116-.547-.173-.778.174-.23.346-.893 1.124-1.096 1.353-.201.23-.403.26-.75.087-.347-.174-1.464-.539-2.788-1.717-1.03-.921-1.724-2.059-1.926-2.406-.202-.346-.02-.533.152-.706.157-.155.347-.403.52-.605.173-.202.23-.347.346-.577.115-.23.058-.433-.03-.605-.087-.173-.778-1.874-1.066-2.567-.28-.673-.563-.58-.778-.59l-.663-.012a1.28 1.28 0 0 0-.922.43c-.316.346-1.21 1.18-1.21 2.87s1.24 3.33 1.412 3.56c.173.23 2.44 3.725 5.912 5.223.827.356 1.473.568 1.977.727.83.265 1.584.228 2.183.139.666-.099 2.053-.838 2.343-1.646.288-.808.288-1.5.202-1.646-.086-.144-.317-.23-.663-.403Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Transportes SCAR</p>
              <p className="text-[10px] text-green-600">En línea</p>
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
              onClick={(e) => e.stopPropagation()}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs"
              placeholder="Escribe tu mensaje"
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
          className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2 text-sm"
        >
          <svg
            viewBox="0 0 32 32"
            className="w-5 h-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.003 2.001C8.823 2.001 3 7.825 3 15.004a12.99 12.99 0 0 0 1.804 6.638L3 29l7.576-2.41A12.975 12.975 0 0 0 16.003 28C23.181 28 29 22.177 29 15.004c0-7.18-5.819-13.003-12.997-13.003Zm-.03 23.03a10.96 10.96 0 0 1-5.66-1.565l-.404-.242-4.491 1.43 1.46-4.374-.263-.45a10.97 10.97 0 0 1-1.643-5.789c0-6.05 4.924-10.974 10.974-10.974 6.05 0 10.974 4.924 10.974 10.974S21.993 25.03 15.974 25.03Zm6.284-7.637c-.346-.173-2.053-1.01-2.37-1.125-.316-.116-.547-.173-.778.174-.23.346-.893 1.124-1.096 1.353-.201.23-.403.26-.75.087-.347-.174-1.464-.539-2.788-1.717-1.03-.921-1.724-2.059-1.926-2.406-.202-.346-.02-.533.152-.706.157-.155.347-.403.52-.605.173-.202.23-.347.346-.577.115-.23.058-.433-.03-.605-.087-.173-.778-1.874-1.066-2.567-.28-.673-.563-.58-.778-.59l-.663-.012a1.28 1.28 0 0 0-.922.43c-.316.346-1.21 1.18-1.21 2.87s1.24 3.33 1.412 3.56c.173.23 2.44 3.725 5.912 5.223.827.356 1.473.568 1.977.727.83.265 1.584.228 2.183.139.666-.099 2.053-.838 2.343-1.646.288-.808.288-1.5.202-1.646-.086-.144-.317-.23-.663-.403Z" />
          </svg>
          WhatsApp
        </button>
      )}
    </div>
  )
}
