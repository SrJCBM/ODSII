import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'react-qr-code';
import { pagoAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { formatMonto, mascararCuenta } from '../utils/helpers';

export default function ConfirmarPago() {
  const navigate = useNavigate();
  const location = useLocation();
  const { receptor, qrCode, montoPreset } = location.state || {};
  const { user, refreshUser } = useAuthStore();
  
  // Si viene monto del QR, usarlo y saltar a confirmación
  const [monto, setMonto] = useState(montoPreset ? montoPreset.toString().replace('.', ',') : '');
  const [descripcion, setDescripcion] = useState('');
  const [step, setStep] = useState(montoPreset ? 'confirmar' : 'monto'); // Si hay monto preset, ir directo a confirmar
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const motivos = [
    { emoji: '🍔', label: 'Comida' },
    { emoji: '💸', label: 'Deuda' },
    { emoji: '🎉', label: 'Entretenimiento' },
    { emoji: '🏠', label: 'Hogar' },
  ];

  if (!receptor) {
    navigate('/pagar-qr');
    return null;
  }

  const handleNumPress = (num) => {
    if (num === 'delete') {
      setMonto(monto.slice(0, -1));
    } else if (num === ',') {
      if (!monto.includes(',') && monto.length > 0) {
        setMonto(monto + ',');
      }
    } else {
      // Limitar decimales a 2
      const parts = monto.split(',');
      if (parts[1] && parts[1].length >= 2) return;
      setMonto(monto + num);
    }
  };

  const montoNumerico = parseFloat(monto.replace(',', '.')) || 0;

  const handleContinuar = () => {
    if (montoNumerico <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    setError('');
    setStep('confirmar');
  };

  const handlePagar = async () => {
    // Validar monto antes de pagar
    if (montoNumerico <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data } = await pagoAPI.pagarQR(qrCode, montoNumerico, descripcion);
      await refreshUser();
      setResultado(data);
      setStep('resultado');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.mensaje || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de ingreso de monto
  if (step === 'monto') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={() => navigate(-1)} className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">¿Cuánto quieres pagar?</h1>
          <button onClick={() => navigate('/')} className="text-purple-700 font-medium">
            Salir
          </button>
        </div>

        {/* Receptor info */}
        <div className="flex flex-col items-center py-6">
          <Avatar nombre={receptor.nombre} apellido={receptor.apellido} size="lg" />
          <h2 className="mt-3 font-semibold text-gray-900 uppercase">
            {receptor.apellido} {receptor.nombre}
          </h2>
          <p className="text-gray-500 text-sm">{receptor.numero_cuenta_masked || mascararCuenta(receptor.numero_cuenta)}</p>
        </div>

        {/* Monto display */}
        <div className="flex-1 flex flex-col items-center px-6">
          <div className="text-5xl font-bold text-purple-700 mb-4">
            ${monto || '0'}
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          {/* Motivos */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            <button 
              onClick={() => setDescripcion('')}
              className={`px-4 py-2 rounded-full border text-sm ${!descripcion ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
            >
              + Motivo
            </button>
            {motivos.map((m) => (
              <button
                key={m.label}
                onClick={() => setDescripcion(m.label)}
                className={`px-4 py-2 rounded-full border text-sm flex items-center gap-1 ${descripcion === m.label ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}
              >
                {m.emoji} {m.label}
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
            onClick={handleContinuar}
            variant="primary"
            fullWidth
            size="lg"
            disabled={montoNumerico <= 0}
            className="mt-4"
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  // Pantalla de confirmación
  if (step === 'confirmar') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setStep('monto')} className="p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => navigate('/')} className="text-purple-700 font-medium">
            Cancelar
          </button>
        </div>

        <div className="flex-1 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Confirmemos tu pago</h1>

          {/* Detalles */}
          <div className="space-y-6">
            {/* Para */}
            <div className="flex items-center gap-4">
              <Avatar nombre={receptor.nombre} apellido={receptor.apellido} size="md" />
              <div>
                <p className="text-sm text-gray-500">Para</p>
                <p className="font-semibold text-gray-900">{receptor.nombre} {receptor.apellido}</p>
                <p className="text-sm text-gray-500">
                  Banco Pichincha {receptor.numero_cuenta_masked || mascararCuenta(receptor.numero_cuenta)}
                </p>
              </div>
            </div>

            {/* Monto */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto</p>
                <p className="font-semibold text-gray-900">USD {formatMonto(montoNumerico)}</p>
              </div>
            </div>

            {/* Desde */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-700 font-bold">d!</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Desde</p>
                <p className="font-semibold text-gray-900">Mi cuenta Deuna</p>
                <p className="text-sm text-gray-500">{mascararCuenta(user?.numero_cuenta)}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Total del pago</span>
            <span className="text-xl font-bold">{formatMonto(montoNumerico)}</span>
          </div>
          <Button
            onClick={handlePagar}
            variant="primary"
            fullWidth
            size="lg"
            loading={loading}
          >
            Pagar
          </Button>
        </div>
      </div>
    );
  }

  // Pantalla de resultado
  if (step === 'resultado') {
    return (
      <div className="min-h-screen bg-purple-700 flex flex-col">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={() => navigate('/')} className="p-2 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Result card */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-xl">
            <div className="text-4xl font-bold text-purple-700 mb-2">d!</div>
            
            <h2 className="text-xl font-bold text-purple-700 mb-1">
              Pagaste a {receptor.nombre} {receptor.apellido}
            </h2>
            
            <p className="text-gray-500 mb-4">Tu dinero llegó al instante</p>
            
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {formatMonto(montoNumerico)}
            </div>

            {resultado?.recarga_automatica && (
              <p className="text-green-600 text-sm mb-4">
                Se recargó automáticamente desde Banco Pichincha 🌿
              </p>
            )}

            <div className="text-left text-sm space-y-2 py-4 border-t">
              <div className="flex justify-between">
                <span className="text-purple-700 font-medium">Fecha de pago</span>
                <span className="text-gray-600">
                  {new Date().toLocaleDateString('es-EC', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-700 font-medium">Nro. de transacción</span>
                <span className="text-gray-600 font-mono text-xs">
                  {resultado?.transaccion?.numero_transaccion || resultado?.qr_validacion || '...'}
                </span>
              </div>
            </div>

            {/* QR de validación */}
            {resultado?.qr_validacion && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">Comprobante de pago</p>
                <div className="p-4 bg-white rounded-xl border-2 border-purple-200">
                  <QRCodeSVG 
                    value={resultado.qr_validacion} 
                    size={160}
                    className="mx-auto"
                  />
                  <p className="text-center text-xs text-gray-500 mt-2 font-mono">
                    {resultado.qr_validacion}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
