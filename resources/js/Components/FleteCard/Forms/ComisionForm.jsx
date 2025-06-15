// resources/js/Components/Forms/ComisionForm.jsx
import { useState } from 'react';

export default function ComisionForm({
  fleteId,
  rendicionId,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [comision, setComision] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!comision) {
      setError('Debes ingresar la comisión.');
      return;
    }
    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: 'Comisión',
      monto: Number(comision),
    };

    try {
      const res = await onSubmit(payload);
      if (res?.data?.flete) {
        onSuccess(res.data.flete);
        setComision('');
        setExito(true);
        setTimeout(() => setExito(false), 2000);
      } else {
        throw new Error('No se devolvió el flete actualizado.');
      }
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (e.response?.data?.errors
          ? Object.values(e.response.data.errors).flat().join(' ')
          : 'Error inesperado al registrar la comisión.');
      setError(msg);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-inner text-xs w-full">
      {error && (
        <div className="text-red-600 text-[10px] bg-red-100 p-2 rounded mb-2">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Columna 1: Comisión manual */}
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          name="comision"
          placeholder="💰 Comisión manual"
          value={comision}
          onChange={e => setComision(e.target.value)}
          className="p-3 h-10 rounded border border-gray-300 bg-white w-full text-base"
        />

        {/* Columna 2: Enviar */}
        <button
          onClick={handleSend}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 h-10 rounded text-[11px] transition-colors w-full"
        >
          Enviar
        </button>
      </div>

      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Comisión registrada
        </div>
      )}
    </div>
  );
}
