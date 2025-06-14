// resources/js/Components/DetailsExtras.jsx
import React from 'react'
import classNames from 'classnames'
import { CurrencyDollarIcon, ArrowRightOnRectangleIcon, BanknotesIcon } from '@heroicons/react/20/solid'

export default function DetailsExtras({
  flete,
  fechaLlegadaFormatted,
  viaticoEfec,
  saldoTemporal,
}) {
  return (
    <div className="flex flex-col items-end whitespace-nowrap">
      <div className="flex items-center gap-x-2 text-green-600">
        <CurrencyDollarIcon className="h-5 w-5" />
        <span>${flete.rendicion?.comision?.toLocaleString('es-CL')||'—'}</span>
      </div>
      <div className="flex items-center gap-x-2 text-gray-500">
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
        <span>{fechaLlegadaFormatted}</span>
      </div>
      <div className={classNames('flex items-center gap-x-2',
        saldoTemporal >= 0 ? 'text-green-600':'text-red-600'
      )}>
        <BanknotesIcon className="h-5 w-5" />
        <span>${saldoTemporal.toLocaleString('es-CL')}</span>
      </div>
    </div>
  )
}
