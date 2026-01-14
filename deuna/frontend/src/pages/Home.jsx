import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { transaccionAPI } from '../services/api';
import Avatar from '../components/Avatar';
import { formatMonto, mascararCuenta, formatFecha } from '../utils/helpers';

export default function Home() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuthStore();
  const [showBalance, setShowBalance] = useState(true);
  const [transacciones, setTransacciones] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  const memoizedRefreshUser = useCallback(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    memoizedRefreshUser();
    fetchTransacciones();
  }, [memoizedRefreshUser]);

  const fetchTransacciones = async () => {
    try {
      const { data } = await transaccionAPI.getAll();
      setTransacciones(data.slice(0, 5)); // Solo las últimas 5
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoadingTx(false);
    }
  };

  const quickActions = [
    { icon: '💸', label: 'Transferir', path: '/transferir' },
    { icon: '📱', label: 'Recargar', path: '/recargar' },
    { icon: '🧾', label: 'Cobrar', path: '/cobrar' },
    { icon: '💳', label: 'Pagar\nservicios', path: '/servicios' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar nombre={user?.nombre} apellido={user?.apellido} size="md" />
            <div>
              <p className="text-gray-600 text-sm">Hola {user?.nombre} 👋</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500 text-sm">Saldo disponible</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showBalance ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {showBalance ? formatMonto(user?.saldo_deuna || 0) : '••••••'}
            </h2>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Info BP */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Recargar desde</p>
                <p className="text-sm font-medium text-gray-700">
                  Principal {mascararCuenta(user?.numero_cuenta)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/recargar')}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  + $20
                </button>
                <span className="text-purple-700 font-bold text-lg">d!</span>
              </div>
            </div>
          </div>

          {/* Saldo BP pequeño */}
          <div 
            className="mt-3 p-3 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition-colors"
            onClick={() => navigate('/recargar')}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">Saldo Banco Pichincha</span>
              <span className="font-semibold text-purple-800">
                {showBalance ? formatMonto(user?.saldo_bp || 0) : '••••••'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-1">{action.icon}</span>
              <span className="text-xs text-center text-gray-700 whitespace-pre-line leading-tight">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4">
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/verificar')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-purple-200 rounded-xl text-purple-700 font-semibold hover:bg-purple-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verificar
          </button>
          <button 
            onClick={() => navigate('/pagar-qr')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-700 rounded-xl text-white font-semibold hover:bg-purple-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h1v1h-1v-1zm-3 0h1v1h-1v-1zm-1 1h1v1h-1v-1zm2 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm-2 0h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1-1h1v1h-1v-1zm-1 1h1v1h-1v-1zm2-3h1v1h-1v-1zm1-1h1v1h-1v-1z"/>
            </svg>
            Pagar a QR
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Movimientos recientes</h3>
          <Link to="/billetera" className="text-purple-700 text-sm font-medium">
            Ver todos
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
          {loadingTx ? (
            <div className="p-4 text-center text-gray-500">Cargando...</div>
          ) : transacciones.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <span className="text-3xl">📭</span>
              <p className="mt-2">No hay movimientos aún</p>
            </div>
          ) : (
            transacciones.map((tx) => {
              const esEnvio = tx.direccion === 'enviado';
              return (
                <div key={tx.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${esEnvio ? 'bg-red-100' : 'bg-green-100'}`}>
                      {esEnvio ? (
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {esEnvio ? 'Enviaste' : 'Recibiste'} pago
                      </p>
                      <p className="text-xs text-gray-500">{formatFecha(tx.fecha)}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${esEnvio ? 'text-red-600' : 'text-green-600'}`}>
                    {esEnvio ? '-' : '+'}{formatMonto(tx.monto)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
