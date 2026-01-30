import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificacion } from '../components/useNotificacion';
import { 
  depositosApi, 
  cuentasApi, 
  cajerosApi,
  CANALES_DEPOSITO,
  TIPOS_DEPOSITO 
} from '../services/api';

// ==================== CONSTANTES ====================
const ESTADO_VALIDACION = {
  INICIAL: 'inicial',
  VALIDANDO: 'validando',
  VALIDO: 'valido',
  INVALIDO: 'invalido',
};

const MENSAJE_ERROR = {
  CUENTA_REQUERIDA: 'Ingrese el número de cuenta',
  CUENTA_INVALIDA: 'Número de cuenta inválido',
  MONTO_REQUERIDO: 'Ingrese un monto válido mayor a 0',
  CAJERO_REQUERIDO: 'Seleccione un cajero automático',
  VALIDAR_PRIMERO: 'Debe validar la cuenta antes de continuar',
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function NuevoDeposito() {
  const navigate = useNavigate();
  const { exito, error: mostrarError } = useNotificacion();
  
  // Estados del formulario
  const [loading, setLoading] = useState(false);
  const [cajeros, setCajeros] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Estado de validación de cuenta
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [estadoValidacion, setEstadoValidacion] = useState(ESTADO_VALIDACION.INICIAL);
  const [cuentaValidada, setCuentaValidada] = useState(null);
  const [errorCuenta, setErrorCuenta] = useState('');
  
  // Datos del depósito
  const [formData, setFormData] = useState({
    monto: '',
    canal_deposito: 'VENTANILLA',
    tipo_deposito: 'EFECTIVO',
    id_cajero: '',
    observaciones: '',
  });

  // ==================== EFECTOS ====================
  useEffect(() => {
    cargarCajeros();
  }, []);

  // ==================== FUNCIONES DE CARGA ====================
  const cargarCajeros = async () => {
    try {
      const response = await cajerosApi.listar();
      setCajeros(response.data.filter(c => c.activo && c.depositos_enabled));
    } catch (error) {
      console.error('Error cargando cajeros:', error);
    }
  };

  // ==================== VALIDACIÓN DE CUENTA ====================
  const validarCuenta = useCallback(async () => {
    if (!numeroCuenta.trim()) {
      setErrorCuenta(MENSAJE_ERROR.CUENTA_REQUERIDA);
      return;
    }

    setEstadoValidacion(ESTADO_VALIDACION.VALIDANDO);
    setErrorCuenta('');
    setCuentaValidada(null);

    try {
      const response = await cuentasApi.validar(numeroCuenta);
      setCuentaValidada(response.data);
      setEstadoValidacion(ESTADO_VALIDACION.VALIDO);
    } catch (error) {
      const mensaje = error.response?.data?.detail || MENSAJE_ERROR.CUENTA_INVALIDA;
      setErrorCuenta(mensaje);
      setEstadoValidacion(ESTADO_VALIDACION.INVALIDO);
    }
  }, [numeroCuenta]);

  const limpiarValidacion = () => {
    setEstadoValidacion(ESTADO_VALIDACION.INICIAL);
    setCuentaValidada(null);
    setErrorCuenta('');
  };

  const handleNumeroCuentaChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Solo números
    setNumeroCuenta(valor);
    
    // Limpiar validación al cambiar el número
    if (estadoValidacion !== ESTADO_VALIDACION.INICIAL) {
      limpiarValidacion();
    }
  };

  // ==================== MANEJO DE FORMULARIO ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar cuenta
    if (estadoValidacion !== ESTADO_VALIDACION.VALIDO) {
      nuevosErrores.cuenta = MENSAJE_ERROR.VALIDAR_PRIMERO;
    }

    // Validar monto
    const monto = parseFloat(formData.monto);
    if (!formData.monto || monto <= 0) {
      nuevosErrores.monto = MENSAJE_ERROR.MONTO_REQUERIDO;
    }

    // Validar cajero si es depósito por cajero automático
    if (formData.canal_deposito === 'CAJERO_AUTOMATICO' && !formData.id_cajero) {
      nuevosErrores.id_cajero = MENSAJE_ERROR.CAJERO_REQUERIDO;
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const datosDeposito = {
        id_cuenta: cuentaValidada.id_cuenta,
        monto: parseFloat(formData.monto),
        canal_deposito: formData.canal_deposito,
        tipo_deposito: formData.tipo_deposito,
        id_cajero: formData.id_cajero ? parseInt(formData.id_cajero) : null,
        observaciones: formData.observaciones || null,
      };

      await depositosApi.crear(datosDeposito);
      
      // Mostrar notificación de éxito y redirigir
      exito(
        `Depósito de $${parseFloat(formData.monto).toFixed(2)} registrado correctamente`,
        'Depósito Creado'
      );
      navigate('/depositos');
    } catch (error) {
      const mensaje = error.response?.data?.detail || 'Error al crear el depósito';
      mostrarError(mensaje, 'Error al crear depósito');
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDERIZADO ====================
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuevo Depósito</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ===== SECCIÓN 1: CUENTA DESTINO ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🏦 Información de la Cuenta
          </h2>

          {/* Input de número de cuenta */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Cuenta Destino *
              </label>
              <input
                type="text"
                value={numeroCuenta}
                onChange={handleNumeroCuentaChange}
                placeholder="Ej: 2200123456"
                maxLength={20}
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                  errorCuenta ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={estadoValidacion === ESTADO_VALIDACION.VALIDANDO}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={validarCuenta}
                disabled={estadoValidacion === ESTADO_VALIDACION.VALIDANDO || !numeroCuenta}
                className="px-6 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {estadoValidacion === ESTADO_VALIDACION.VALIDANDO ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Validando...
                  </span>
                ) : 'Validar cuenta'}
              </button>
            </div>
          </div>

          {/* Error de cuenta */}
          {errorCuenta && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm flex items-center gap-2">
                <span>❌</span> {errorCuenta}
              </p>
            </div>
          )}

          {/* Información de cuenta validada */}
          {cuentaValidada && estadoValidacion === ESTADO_VALIDACION.VALIDO && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Cuenta Válida</p>
                  <div className="mt-2 space-y-1 text-sm text-green-700">
                    <p><strong>Titular:</strong> {cuentaValidada.titular_nombre}</p>
                    <p><strong>Tipo:</strong> {cuentaValidada.tipo_cuenta}</p>
                    {cuentaValidada.titular_cedula && (
                      <p><strong>Cédula:</strong> {cuentaValidada.titular_cedula}</p>
                    )}
                    {cuentaValidada.titular_correo && (
                      <p><strong>Correo:</strong> {cuentaValidada.titular_correo}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={limpiarValidacion}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {errors.cuenta && (
            <p className="text-red-500 text-sm mt-2">{errors.cuenta}</p>
          )}
        </div>

        {/* ===== SECCIÓN 2: DATOS DEL DEPÓSITO ===== */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            💰 Datos del Depósito
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto a Depositar *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  name="monto"
                  value={formData.monto}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className={`w-full border rounded-lg px-4 py-3 pl-8 focus:ring-2 focus:ring-yellow-500 ${
                    errors.monto ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.monto && (
                <p className="text-red-500 text-sm mt-1">{errors.monto}</p>
              )}
            </div>

            {/* Canal de Depósito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Canal de Depósito *
              </label>
              <select
                name="canal_deposito"
                value={formData.canal_deposito}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500"
              >
                {Object.values(CANALES_DEPOSITO).map(canal => (
                  <option key={canal.value} value={canal.value}>
                    {canal.icono} {canal.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Depósito */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Depósito *
              </label>
              <select
                name="tipo_deposito"
                value={formData.tipo_deposito}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500"
              >
                {Object.values(TIPOS_DEPOSITO).map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.icono} {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cajero (condicional) */}
            {formData.canal_deposito === 'CAJERO_AUTOMATICO' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cajero Automático *
                </label>
                <select
                  name="id_cajero"
                  value={formData.id_cajero}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 ${
                    errors.id_cajero ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccione un cajero</option>
                  {cajeros.map(cajero => (
                    <option key={cajero.id_cajero} value={cajero.id_cajero}>
                      🏧 {cajero.nombre} - {cajero.ciudad}
                    </option>
                  ))}
                </select>
                {errors.id_cajero && (
                  <p className="text-red-500 text-sm mt-1">{errors.id_cajero}</p>
                )}
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones (Opcional)
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales del depósito..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        </div>

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || estadoValidacion !== ESTADO_VALIDACION.VALIDO}
            className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                💰 Confirmar Depósito
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/depositos')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
