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
  const comision = Math.min(Math.max(montoNumerico * 0.005, 0.10), 5.00);
  const total = montoNumerico + comision;

  const handleConfirmar = async () => {
    if (montoNumerico < 1) {
      setError('El monto mínimo de transferencia es $1.00');
      return;
    }

    if (total > (user?.saldo_deuna || 0)) {
      setError('Saldo insuficiente. Se recargará automáticamente desde BP si hay fondos.');
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        monto: montoNumerico,
        descripcion: descripcion || 'Transferencia Deuna',
        fuente: 'deuna'
      };

      // Agregar el identificador del destinatario
      if (tipoDestino === 'cuenta') {
        payload.cuenta_destino = destino;
      } else if (tipoDestino === 'telefono') {
        payload.telefono_destino = destino;
      } else {
        payload.correo_destino = destino;
      }

      const { data } = await api.post('/transferencias', payload);
      await refreshUser();
      
      setSuccess({
        monto: montoNumerico,
        comision: data.transaccion.comision || comision,
        total: data.transaccion.monto_total || total,
        destinatario: destinatario,
        numero_transaccion: data.transaccion.numero_transaccion,
        nuevoSaldo: user?.saldo_deuna - total,
        recarga_automatica: data.transaccion.recarga_automatica
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la transferencia');
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
            <p className="text-gray-500 mb-4">
              Enviaste a {success.destinatario?.nombre} {success.destinatario?.apellido}
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
            className={`w-2 h-2 rounded-full ${s <= step ? 'bg-white' : 'bg-white/30'}`}
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
            <div className="bg-white/10 mx-4 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center">
                <span className="text-purple-900 font-bold text-lg">
                  {destinatario.nombre?.[0]}{destinatario.apellido?.[0]}
                </span>
              </div>
              <div className="text-white">
                <p className="font-semibold">{destinatario.nombre} {destinatario.apellido}</p>
                <p className="text-sm text-purple-200">
                  ******{destinatario.numero_cuenta?.slice(-4)}
                </p>
              </div>
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
            <div className="text-center py-8">
              <p className="text-purple-200 text-sm mb-2">Monto a transferir</p>
              <p className="text-white text-5xl font-bold">
                ${monto || '0'}
              </p>
              {montoNumerico > 0 && (
                <p className="text-purple-200 text-sm mt-2">
                  + {formatMonto(comision)} comisión = {formatMonto(total)}
                </p>
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

            {/* Saldo disponible */}
            <div className="text-center text-purple-200 text-sm mt-4">
              Saldo Deuna: {formatMonto(user?.saldo_deuna || 0)}
              {user?.saldo_bp > 0 && (
                <span className="block text-xs">
                  + {formatMonto(user.saldo_bp)} disponible en BP
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center mt-2 px-4">{error}</p>
            )}

            {/* Teclado numérico */}
            <div className="bg-white rounded-t-3xl mt-auto p-4">
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, ',', 0, 'delete'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleNumPress(num)}
                    className="h-14 rounded-xl text-xl font-semibold bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
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
                onClick={() => montoNumerico >= 1 && setStep(3)}
                disabled={montoNumerico < 1}
                className="w-full mt-4"
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
            
            <div className="bg-white rounded-2xl p-6 space-y-4">
              {/* Destinatario */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-700 font-bold">
                    {destinatario.nombre?.[0]}{destinatario.apellido?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {destinatario.nombre} {destinatario.apellido}
                  </p>
                  <p className="text-sm text-gray-500">
                    Cuenta ******{destinatario.numero_cuenta?.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monto</span>
                  <span className="font-semibold">{formatMonto(montoNumerico)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Comisión (0.5%)</span>
                  <span className="font-semibold">{formatMonto(comision)}</span>
                </div>
                {descripcion && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Descripción</span>
                    <span className="text-sm text-gray-700">{descripcion}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-900 font-medium">Total a debitar</span>
                  <span className="font-bold text-purple-700 text-lg">{formatMonto(total)}</span>
                </div>
              </div>

              {total > (user?.saldo_deuna || 0) && user?.saldo_bp > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 text-sm text-orange-700">
                  <p className="font-medium">⚡ Recarga automática</p>
                  <p className="text-xs mt-1">
                    Se recargará {formatMonto(total - (user?.saldo_deuna || 0))} desde Banco Pichincha
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>

            <div className="mt-auto space-y-3">
              <Button
                onClick={handleConfirmar}
                loading={loading}
                className="w-full"
              >
                Confirmar transferencia
              </Button>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 text-white font-medium"
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
