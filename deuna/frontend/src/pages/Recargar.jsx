import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { formatMonto } from '../utils/helpers';
import api from '../services/api';

export default function Recargar() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const montosRapidos = [5, 10, 20, 50, 100];

  const handleNumPress = (num) => {
    if (num === 'delete') {
      setMonto(monto.slice(0, -1));
    } else if (num === ',') {
      if (!monto.includes(',') && monto.length > 0) {
        setMonto(monto + ',');
      }
    } else {
      const parts = monto.split(',');
      if (parts[1] && parts[1].length >= 2) return;
      // Limitar a un máximo razonable
      const montoActual = parseFloat((monto + num).replace(',', '.')) || 0;
      if (montoActual <= 10000) {
        setMonto(monto + num);
      }
    }
    setError('');
  };

  const montoNumerico = parseFloat(monto.replace(',', '.')) || 0;

  const handleRecargar = async () => {
    if (montoNumerico < 3) {
      setError('El monto mínimo de recarga es $3.00');
      return;
    }

    if (montoNumerico > (user?.saldo_bp || 0)) {
      setError('No tienes suficiente saldo en Banco Pichincha');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/usuarios/recargar', { monto: montoNumerico });
      await refreshUser();
      setSuccess({
        monto: montoNumerico,
        nuevoSaldoDeuna: data.saldo_deuna,
        nuevoSaldoBP: data.saldo_bp,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la recarga');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-500 to-green-700 flex flex-col">
        <div className="flex justify-end p-4">
          <button onClick={() => navigate('/')} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Recarga exitosa!</h2>
            <p className="text-gray-500 mb-4">Se recargaron a tu cuenta Deuna</p>
            
            <div className="text-4xl font-bold text-green-600 mb-6">
              {formatMonto(success.monto)}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Nuevo saldo Deuna</span>
                <span className="font-semibold text-purple-700">{formatMonto(success.nuevoSaldoDeuna)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Saldo Banco Pichincha</span>
                <span className="font-semibold text-gray-700">{formatMonto(success.nuevoSaldoBP)}</span>
              </div>
            </div>

            <Button
              onClick={() => navigate('/')}
              variant="primary"
              fullWidth
              className="mt-6"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => navigate(-1)} className="p-2">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Recargar saldo</h1>
        <div className="w-10" />
      </div>

      {/* Info de saldos */}
      <div className="px-4 py-4">
        <div className="bg-purple-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-purple-700 font-bold">d!</span>
              <span className="text-gray-600">Saldo Deuna</span>
            </div>
            <span className="font-bold text-purple-700">{formatMonto(user?.saldo_deuna || 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-green-700 font-bold text-sm">BP</span>
              <span className="text-gray-600">Disponible para recargar</span>
            </div>
            <span className="font-bold text-green-700">{formatMonto(user?.saldo_bp || 0)}</span>
          </div>
        </div>
      </div>

      {/* Monto a recargar */}
      <div className="flex-1 flex flex-col items-center px-6 py-4">
        <p className="text-gray-500 mb-2">¿Cuánto quieres recargar?</p>
        <div className="text-5xl font-bold text-purple-700 mb-2">
          ${monto || '0'}
        </div>
        <p className="text-sm text-gray-400 mb-4">Mínimo $3.00</p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Montos rápidos */}
        <div className="flex gap-2 flex-wrap justify-center mb-4">
          {montosRapidos.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMonto(m.toString());
                setError('');
              }}
              disabled={m > (user?.saldo_bp || 0)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors
                ${monto === m.toString() 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-gray-300 text-gray-600 hover:border-purple-300'}
                ${m > (user?.saldo_bp || 0) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              ${m}
            </button>
          ))}
        </div>
      </div>

      {/* Numpad */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0, 'delete'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumPress(num.toString())}
              className="h-14 rounded-xl text-xl font-medium text-purple-700 hover:bg-purple-100 transition-colors flex items-center justify-center"
            >
              {num === 'delete' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                </svg>
              ) : num}
            </button>
          ))}
        </div>

        <Button
          onClick={handleRecargar}
          variant="primary"
          fullWidth
          size="lg"
          loading={loading}
          disabled={montoNumerico < 3 || montoNumerico > (user?.saldo_bp || 0)}
          className="mt-4"
        >
          Recargar {montoNumerico >= 3 ? formatMonto(montoNumerico) : ''}
        </Button>
      </div>
    </div>
  );
}
