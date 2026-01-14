import { useState, useEffect, useCallback } from 'react';
import { transaccionAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import BottomNav from '../components/BottomNav';
import { formatMonto } from '../utils/helpers';

export default function Billetera() {
  const { user, refreshUser } = useAuthStore();
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'enviados' | 'recibidos'

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
      setTransacciones(data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const transaccionesFiltradas = (transacciones || []).filter((tx) => {
    if (filtro === 'todos') return true;
    if (filtro === 'enviados') return tx.direccion === 'enviado';
    if (filtro === 'recibidos') return tx.direccion === 'recibido';
    return true;
  });

  // Agrupar por fecha
  const agruparPorFecha = (txs) => {
    const grupos = {};
    txs.forEach((tx) => {
      const fechaStr = new Date(tx.fecha).toLocaleDateString('es-EC', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!grupos[fechaStr]) grupos[fechaStr] = [];
      grupos[fechaStr].push(tx);
    });
    return grupos;
  };

  const grupos = agruparPorFecha(transaccionesFiltradas);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-purple-700 px-4 py-6">
        <h1 className="text-white text-xl font-bold mb-4">Mi Billetera</h1>
        
        {/* Saldos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <p className="text-purple-200 text-sm">Saldo Deuna</p>
            <p className="text-white text-2xl font-bold">
              {formatMonto(user?.saldo_deuna || 0)}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-4">
            <p className="text-purple-200 text-sm">Saldo Banco Pichincha</p>
            <p className="text-white text-2xl font-bold">
              {formatMonto(user?.saldo_bp || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 py-3 bg-white border-b sticky top-0 z-10">
        <div className="flex gap-2">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'enviados', label: 'Enviados' },
            { key: 'recibidos', label: 'Recibidos' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filtro === f.key
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transacciones */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
          </div>
        ) : transaccionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">📭</span>
            <p className="mt-4 text-gray-500">No hay movimientos</p>
          </div>
        ) : (
          Object.entries(grupos).map(([fecha, txs]) => (
            <div key={fecha} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">{fecha}</h3>
              <div className="bg-white rounded-xl shadow-sm divide-y">
                {txs.map((tx) => {
                  const esEnvio = tx.direccion === 'enviado';
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          esEnvio ? 'bg-red-100' : 'bg-green-100'
                        }`}>
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
                          <p className="font-medium text-gray-900">
                            {esEnvio ? 'Pago enviado' : 'Pago recibido'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tx.descripcion || tx.tipo}
                            {tx.recarga_automatica && (
                              <span className="ml-1 text-green-600">• Recarga auto</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-semibold ${esEnvio ? 'text-red-600' : 'text-green-600'}`}>
                          {esEnvio ? '-' : '+'}{formatMonto(tx.monto)}
                        </span>
                        <p className="text-xs text-gray-400">
                          {new Date(tx.fecha).toLocaleTimeString('es-EC', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
