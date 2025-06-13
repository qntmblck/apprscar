// resources/js/Components/Pagination.jsx
import React from 'react'
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pagination({
  current_page,
  last_page,
  prev_page_url,
  next_page_url,
  get,
  data
}) {
  const pagesToShow = last_page <= 6
    ? Array.from({ length: last_page }, (_, i) => i + 1)
    : [1, 2, 3, 'ellipsis', last_page - 2, last_page - 1, last_page]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="flex items-center border-t border-gray-200 px-4 py-3">
        {/* Botón Anterior */}
        <button
          onClick={() => prev_page_url && get(prev_page_url, { preserveState: true, data })}
          disabled={!prev_page_url}
          className={classNames(
            'inline-flex items-center border-t-2 border-transparent pr-2 pt-1 text-sm font-medium',
            prev_page_url
              ? 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
              : 'text-gray-300 cursor-not-allowed'
          )}
        >
          <ArrowLongLeftIcon className="mr-2 h-5 w-5 text-gray-400" />
          Anterior
        </button>

        {/* Página actual en móvil */}
        <div className="md:hidden flex-1 text-center">
          <span className="text-sm font-medium text-gray-700">
            Página {current_page} de {last_page}
          </span>
        </div>

        {/* Páginas en desktop */}
        <div className="hidden md:flex flex-1 justify-center space-x-1">
          {pagesToShow.map((p, idx) =>
            p === 'ellipsis' ? (
              <span
                key={`e${idx}`}
                className="inline-flex items-center border-t-2 border-transparent px-3 pt-1 text-sm font-medium text-gray-500"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() =>
                  get(route('fletes.index', { page: p }), {
                    preserveState: true,
                    data,
                  })
                }
                aria-current={p === current_page ? 'page' : undefined}
                className={classNames(
                  'inline-flex items-center border-t-2 px-3 pt-1 text-sm font-medium',
                  p === current_page
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={() => next_page_url && get(next_page_url, { preserveState: true, data })}
          disabled={!next_page_url}
          className={classNames(
            'inline-flex items-center border-t-2 border-transparent pl-2 pt-1 text-sm font-medium',
            next_page_url
              ? 'text-gray-600 hover:text-gray-800 hover:border-gray-300'
              : 'text-gray-300 cursor-not-allowed'
          )}
        >
          Siguiente
          <ArrowLongRightIcon className="ml-2 h-5 w-5 text-gray-400" />
        </button>
      </nav>
    </div>
  )
}
