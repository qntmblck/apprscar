// resources/js/Components/Forms/RetornoForm.jsx
import { useState } from 'react';

export default function RetornoForm({
  fleteId,
  rendicionId,
  onSubmit,   // (payload) => Promise(axios response)
  onCancel,
  onSuccess,  // callback con el flete actualizado
}) {
  const [monto, setMonto] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleSend = async () => {
    setError(null);
    if (!monto) {
      setError('Debes ingresar un monto.');
      return;
    }
    const payload = {
      flete_id: fleteId,
      rendicion_id: rendicionId,
      tipo: 'Retorno',
      monto: Number(monto),
    };

    try {
      const res = await onSubmit(payload);
      if (res?.data?.flete) {
        onSuccess(res.data.flete);
        setMonto('');
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
          : 'Error inesperado al registrar el retorno.');
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

      <label className="block text-[11px] font-medium text-gray-700">Monto Retorno</label>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        className="mt-1 block w-full rounded border-gray-300 text-[11px] py-1 px-2"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSend}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-[11px] w-full"
        >
          Enviar
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-[11px] w-full"
        >
          Cancelar
        </button>
      </div>

      {exito && (
        <div className="text-green-600 text-[10px] bg-green-100 p-2 rounded mt-2">
          ✔️ Retorno registrado
        </div>
      )}
    </div>
  );
}
