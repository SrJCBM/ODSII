import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { useAuthStore } from '../store/authStore';
import Avatar from '../components/Avatar';
import { mascararCuenta, formatMonto } from '../utils/helpers';

export default function Cobrar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [monto, setMonto] = useState('');
  const [showQR, setShowQR] = useState(false);

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
      setMonto(monto + num);
    }
  };

  const montoNumerico = parseFloat(monto.replace(',', '.')) || 0;

  if (showQR) {
    return (
      <div className="min-h-screen bg-purple-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setShowQR(false)} className="p-2 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-semibold">Mi código QR</h1>
          <button onClick={() => navigate('/')} className="text-white font-medium">
            Cerrar
          </button>
        </div>

        {/* QR Card */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center">
            <Avatar 
              nombre={user?.nombre} 
              apellido={user?.apellido} 
              size="lg" 
              className="mx-auto mb-4"
            />
            
            <h2 className="font-bold text-gray-900 text-lg">
              {user?.nombre} {user?.apellido}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {mascararCuenta(user?.numero_cuenta)}
            </p>

            {montoNumerico > 0 && (
              <div className="mb-4 p-3 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-600">Monto a cobrar</p>
                <p className="text-2xl font-bold text-purple-700">
                  {formatMonto(montoNumerico)}
                </p>
              </div>
            )}

            {/* QR Code - incluye monto si está especificado */}
            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl inline-block">
              <QRCode
                value={montoNumerico > 0 
                  ? `${user?.qr_code}|${montoNumerico.toFixed(2)}`
                  : (user?.qr_code || '')
                }
                size={180}
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Muestra este código para recibir pagos
            </p>

            {/* Share button */}
            <button className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-purple-100 text-purple-700 rounded-xl font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir QR
            </button>
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
        <h1 className="text-lg font-semibold">Cobrar</h1>
        <button onClick={() => navigate('/')} className="text-purple-700 font-medium">
          Salir
        </button>
      </div>

      {/* User info */}
      <div className="flex flex-col items-center py-6">
        <Avatar nombre={user?.nombre} apellido={user?.apellido} size="lg" />
        <h2 className="mt-3 font-semibold text-gray-900">
          {user?.nombre} {user?.apellido}
        </h2>
        <p className="text-gray-500 text-sm">{mascararCuenta(user?.numero_cuenta)}</p>
      </div>

      {/* Amount input */}
      <div className="flex-1 flex flex-col items-center px-6">
        <p className="text-gray-500 mb-2">Monto a cobrar (opcional)</p>
        <div className="text-5xl font-bold text-purple-700 mb-4">
          ${monto || '0'}
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

        <button
          onClick={() => setShowQR(true)}
          className="w-full mt-4 py-4 bg-purple-700 text-white rounded-xl font-semibold text-lg hover:bg-purple-800 transition-colors"
        >
          Mostrar mi QR
        </button>
      </div>
    </div>
  );
}
