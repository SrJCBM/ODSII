import { useState, useEffect, useCallback } from 'react';
import { depositosApi } from '../services/api';
import { useNotificacion } from '../components/useNotificacion';

export default function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { error: mostrarError } = useNotificacion();

  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await depositosApi.estadisticas();
      setEstadisticas(response.data);
      setError(null);
    } catch (err) {
      const mensaje = 'Error al cargar estadísticas';
      setError(mensaje);
      mostrarError(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [mostrarError]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard de Depósitos</h1>
      
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">Total Depósitos</h3>
          <p className="text-3xl font-bold text-gray-800">{estadisticas?.total_depositos || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">Monto Total</h3>
          <p className="text-3xl font-bold text-gray-800">
            ${estadisticas?.monto_total?.toLocaleString('es-EC', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-medium">Promedio por Depósito</h3>
          <p className="text-3xl font-bold text-gray-800">
            ${estadisticas?.promedio_deposito?.toLocaleString('es-EC', { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </div>
      </div>

      {/* Estadísticas por Canal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Por Canal</h2>
          <div className="space-y-3">
            {estadisticas?.por_canal?.map((canal) => (
              <div key={canal.canal} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-700">{canal.canal}</span>
                  <span className="text-gray-500 text-sm ml-2">({canal.cantidad} depósitos)</span>
                </div>
                <span className="font-bold text-green-600">
                  ${canal.monto_total?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Por Estado</h2>
          <div className="space-y-3">
            {estadisticas?.por_estado?.map((estado) => (
              <div key={estado.estado} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${
                    estado.estado === 'PROCESADO' ? 'bg-green-500' :
                    estado.estado === 'PENDIENTE' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-medium text-gray-700">{estado.estado}</span>
                  <span className="text-gray-500 text-sm ml-2">({estado.cantidad})</span>
                </div>
                <span className="font-bold text-green-600">
                  ${estado.monto_total?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
