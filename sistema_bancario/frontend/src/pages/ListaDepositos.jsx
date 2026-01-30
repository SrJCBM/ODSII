import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { depositosApi } from '../services/api';
import { useNotificacion } from '../components/useNotificacion';

export default function ListaDepositos() {
  const [depositos, setDepositos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { exito, error: mostrarError, advertencia } = useNotificacion();
  const [filtros, setFiltros] = useState({
    canal_deposito: '',
    estado: '',
  });

  useEffect(() => {
    cargarDepositos();
  }, [filtros]);

  const cargarDepositos = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filtros.canal_deposito) params.canal_deposito = filtros.canal_deposito;
      if (filtros.estado) params.estado = filtros.estado;
      
      const response = await depositosApi.listar(params);
      setDepositos(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar depósitos');
      mostrarError('No se pudieron cargar los depósitos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await depositosApi.actualizar(id, { estado: nuevoEstado });
      exito(`Depósito ${nuevoEstado.toLowerCase()} correctamente`);
      cargarDepositos();
    } catch (err) {
      mostrarError(err.response?.data?.detail || 'Error al actualizar estado');
    }
  };

  const eliminarDeposito = async (id) => {
    if (!confirm('¿Está seguro de eliminar este depósito?')) return;
    try {
      await depositosApi.eliminar(id);
      exito('Depósito eliminado correctamente');
      cargarDepositos();
    } catch (err) {
      mostrarError(err.response?.data?.detail || 'Error al eliminar');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Depósitos</h1>
        <Link
          to="/depositos/nuevo"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          + Nuevo Depósito
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-4 flex gap-4 flex-wrap">
        <select
          value={filtros.canal_deposito}
          onChange={(e) => setFiltros({ ...filtros, canal_deposito: e.target.value })}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos los canales</option>
          <option value="VENTANILLA">Ventanilla</option>
          <option value="CAJERO_AUTOMATICO">Cajero Automático</option>
          <option value="APP_MOVIL">App Móvil</option>
          <option value="BANCA_WEB">Banca Web</option>
          <option value="CORRESPONSAL">Corresponsal</option>
        </select>
        
        <select
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="PROCESADO">Procesado</option>
          <option value="RECHAZADO">Rechazado</option>
        </select>
        
        <button
          onClick={() => setFiltros({ canal_deposito: '', estado: '' })}
          className="text-gray-600 hover:text-gray-800 underline"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {depositos.map((deposito) => (
                <tr key={deposito.id_deposito} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deposito.id_deposito}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatearFecha(deposito.fecha_deposito)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deposito.cuenta_numero}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deposito.persona_nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {deposito.canal_deposito}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${deposito.monto?.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deposito.estado === 'PROCESADO' ? 'bg-green-100 text-green-800' :
                      deposito.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {deposito.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {deposito.estado === 'PENDIENTE' && (
                      <>
                        <button
                          onClick={() => actualizarEstado(deposito.id_deposito, 'PROCESADO')}
                          className="text-green-600 hover:text-green-800"
                          title="Aprobar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => actualizarEstado(deposito.id_deposito, 'RECHAZADO')}
                          className="text-red-600 hover:text-red-800"
                          title="Rechazar"
                        >
                          ✗
                        </button>
                        <button
                          onClick={() => eliminarDeposito(deposito.id_deposito)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Eliminar"
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {depositos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron depósitos
            </div>
          )}
        </div>
      )}
    </div>
  );
}
