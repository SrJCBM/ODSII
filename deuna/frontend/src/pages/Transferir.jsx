import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Input from '../components/Input';
import { formatMonto } from '../utils/helpers';
import api from '../services/api';

export default function Transferir() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  
  // Datos de la transferencia
  const [destino, setDestino] = useState('');
  const [tipoDestino, setTipoDestino] = useState('cuenta');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destinatario, setDestinatario] = useState(null);

  const montosRapidos = [10, 25, 50, 100, 200];

  // Buscar destinatario
  const buscarDestinatario = useCallback(async () => {
    if (!destino.trim()) {
      setError('Ingresa un número de cuenta, teléfono o correo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/usuarios/buscar?${tipoDestino}=${encodeURIComponent(destino)}`);
      if (data.usuario) {
        setDestinatario(data.usuario);
        setStep(2);
      } else {
        setError('No se encontró el destinatario');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Usuario no encontrado');
    } finally {
      setLoading(false);
    }
  }, [destino, tipoDestino]);

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
      const montoActual = parseFloat((monto + num).replace(',', '.')) || 0;
      if (montoActual <= 10000) {
        setMonto(monto + num);
      }
    }
    setError('');
  };

  const montoNumerico = parseFloat(monto.replace(',', '.')) || 0;
  const comision = montoNumerico > 0 ? Math.min(Math.max(montoNumerico * 0.005, 0.10), 5.00) : 0;
  const total = montoNumerico + comision;

  const handleConfirmar = async () => {
    if (montoNumerico < 1) {
      setError('El monto mínimo de transferencia es $1.00');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        destinatario: destino, // El backend acepta cuenta, telefono o correo en un solo campo
        monto: montoNumerico,
        descripcion: descripcion || 'Transferencia Deuna'
      };

      const { data } = await api.post('/transferencias', payload);
      await refreshUser();
      
      setSuccess({
        monto: montoNumerico,
        comision: data.transaccion?.comision || comision,
        total: data.transaccion?.monto_total || total,
        destinatario: destinatario,
        numero_transaccion: data.transaccion?.numero_transaccion,
        nuevoSaldo: user?.saldo_deuna - total,
        recarga_automatica: data.transaccion?.recarga_automatica
      });
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al procesar la transferencia');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
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
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Transferencia exitosa!</h2>
            <p className="text-gray-500 mb-2">
              Enviaste a {success.destinatario?.nombre} {success.destinatario?.apellido}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Cuenta: {success.destinatario?.numero_cuenta}
            </p>
            
            <div className="text-4xl font-bold text-green-600 mb-2">
              {formatMonto(success.monto)}
            </div>
            
            {success.recarga_automatica && (
              <p className="text-sm text-orange-600 mb-4">
                ⚡ Se recargó automáticamente desde BP
              </p>
            )}

            <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Monto</span>
                <span className="font-semibold">{formatMonto(success.monto)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Comisión (0.5%)</span>
                <span className="font-semibold">{formatMonto(success.comision)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-700 font-medium">Total debitado</span>
                <span className="font-bold text-purple-700">{formatMonto(success.total)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-500">Número de transacción</span>
                <span className="font-mono text-xs">{success.numero_transaccion}</span>
              </div>
            </div>

            <Button onClick={() => navigate('/')} className="w-full mt-6">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-purple-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Transferir</h1>
        <button onClick={() => navigate('/')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`rounded-full transition-all duration-300 ${
              s === step ? 'w-6 h-2 bg-white' : s < step ? 'w-2 h-2 bg-white' : 'w-2 h-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Step 1: Buscar destinatario */}
        {step === 1 && (
          <div className="flex-1 flex flex-col p-6">
            <h2 className="text-white text-xl font-bold mb-4">¿A quién transferir?</h2>
            
            {/* Tipo de búsqueda */}
            <div className="flex gap-2 mb-4">
              {[
                { value: 'cuenta', label: 'Cuenta' },
                { value: 'telefono', label: 'Teléfono' },
                { value: 'correo', label: 'Correo' }
              ].map(t => (
                <button
                  key={t.value}
                  onClick={() => { setTipoDestino(t.value); setDestino(''); setError(''); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    tipoDestino === t.value
                      ? 'bg-white text-purple-700'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Input
              placeholder={
                tipoDestino === 'cuenta' ? 'Número de cuenta Deuna' :
                tipoDestino === 'telefono' ? 'Número de teléfono' :
                'Correo electrónico'
              }
              value={destino}
              onChange={(e) => { setDestino(e.target.value); setError(''); }}
              type={tipoDestino === 'correo' ? 'email' : 'text'}
              className="mb-4"
            />

            {error && (
              <p className="text-red-300 text-sm mb-4">{error}</p>
            )}

            <div className="mt-auto">
              <Button
                onClick={buscarDestinatario}
                loading={loading}
                className="w-full"
              >
                Buscar destinatario
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Ingresar monto */}
        {step === 2 && destinatario && (
          <div className="flex-1 flex flex-col">
            {/* Destinatario info */}
            <div className="bg-white/10 backdrop-blur-sm mx-4 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {destinatario.nombre?.[0]}{destinatario.apellido?.[0]}
                </span>
              </div>
              <div className="text-white flex-1">
                <p className="font-semibold">{destinatario.nombre} {destinatario.apellido}</p>
                <p className="text-sm text-purple-200 font-mono">
                  Cuenta: {destinatario.numero_cuenta}
                </p>
              </div>
              <button onClick={() => setStep(1)} className="text-purple-200 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* Montos rápidos */}
            <div className="flex gap-2 px-4 mt-4 overflow-x-auto">
              {montosRapidos.map(m => (
                <button
                  key={m}
                  onClick={() => setMonto(String(m))}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                    montoNumerico === m
                      ? 'bg-white text-purple-700'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  ${m}
                </button>
              ))}
            </div>

            {/* Monto display */}
            <div className="text-center py-6">
              <p className="text-purple-200 text-sm mb-2">Monto a transferir</p>
              <p className="text-white text-5xl font-bold">
                ${monto || '0'}
              </p>
              {montoNumerico > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
                  <span className="text-purple-100 text-xs">Comisión {formatMonto(comision)}</span>
                  <span className="text-white text-xs font-semibold">Total: {formatMonto(total)}</span>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="px-4">
              <Input
                placeholder="Descripción (opcional)"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder-purple-200"
              />
            </div>

            {/* Saldo disponible - pill style */}
            <div className="mx-4 mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-400/30 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Saldo Deuna</p>
                  {user?.saldo_bp > 0 && (
                    <p className="text-purple-300 text-xs">+ {formatMonto(user.saldo_bp)} en BP</p>
                  )}
                </div>
              </div>
              <p className="text-white font-bold text-lg">{formatMonto(user?.saldo_deuna || 0)}</p>
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center mt-2 px-4">{error}</p>
            )}

            {/* Teclado numérico */}
            <div className="bg-white rounded-t-3xl mt-auto p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0, 'delete'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumPress(num)}
                    className="h-12 rounded-xl text-lg font-semibold bg-gray-50 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    {num === 'delete' ? (
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                      </svg>
                    ) : num}
                  </button>
                ))}
              </div>
              
              <Button
                onClick={() => montoNumerico >= 1 && setStep(3)}
                disabled={montoNumerico < 1}
                className="w-full mt-3"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmar */}
        {step === 3 && destinatario && (
          <div className="flex-1 flex flex-col p-6">
            <h2 className="text-white text-xl font-bold mb-6 text-center">Confirmar transferencia</h2>
            
            <div className="bg-white rounded-2xl p-5 space-y-0 shadow-lg">
              {/* Destinatario */}
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {destinatario.nombre?.[0]}{destinatario.apellido?.[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {destinatario.nombre} {destinatario.apellido}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    Cuenta: {destinatario.numero_cuenta}
                  </p>
                </div>
              </div>

              {/* Monto grande centrado */}
              <div className="text-center py-4 border-b border-gray-100">
                <p className="text-gray-400 text-xs mb-1">Monto a transferir</p>
                <p className="text-3xl font-bold text-gray-900">{formatMonto(montoNumerico)}</p>
              </div>

              {/* Detalles */}
              <div className="py-3 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Comisión (0.5%)</span>
                  <span className="font-medium text-sm text-gray-700">{formatMonto(comision)}</span>
                </div>
                {descripcion && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Nota</span>
                    <span className="text-sm text-gray-700 max-w-[60%] text-right">{descripcion}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
                  <span className="text-gray-900 font-semibold text-sm">Total a debitar</span>
                  <span className="font-bold text-purple-700">{formatMonto(total)}</span>
                </div>
              </div>

              {total > (user?.saldo_deuna || 0) && user?.saldo_bp > 0 && (
                <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700 border border-amber-100">
                  <p className="font-medium text-xs">⚡ Recarga automática</p>
                  <p className="text-xs mt-0.5">
                    Se recargará {formatMonto(total - (user?.saldo_deuna || 0))} desde Banco Pichincha
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center pt-2">{error}</p>
              )}
            </div>

            {/* Saldo info */}
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-white/10">
              <span className="text-purple-200 text-sm">Tu saldo disponible</span>
              <span className="text-white font-bold">{formatMonto(user?.saldo_deuna || 0)}</span>
            </div>

            <div className="mt-auto pt-6 space-y-3">
              <Button
                onClick={handleConfirmar}
                loading={loading}
                className="w-full"
              >
                Confirmar transferencia
              </Button>
              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 text-white/80 hover:text-white font-medium text-sm transition"
              >
                Modificar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
