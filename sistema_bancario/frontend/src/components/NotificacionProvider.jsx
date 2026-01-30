import { useState, useEffect, useCallback } from 'react';
import { NotificacionContext } from './NotificacionContext';

// ==================== TIPOS DE NOTIFICACIÓN ====================
const TIPOS = {
  SUCCESS: {
    icono: '✅',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-800',
    iconBg: 'bg-green-100',
  },
  ERROR: {
    icono: '❌',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-800',
    iconBg: 'bg-red-100',
  },
  WARNING: {
    icono: '⚠️',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-800',
    iconBg: 'bg-yellow-100',
  },
  INFO: {
    icono: 'ℹ️',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    iconBg: 'bg-blue-100',
  },
};

// ==================== COMPONENTE TOAST ====================
function Toast({ notificacion, onClose }) {
  const { tipo, titulo, mensaje, duracion = 5000 } = notificacion;
  const estilos = TIPOS[tipo] || TIPOS.INFO;

  useEffect(() => {
    if (duracion > 0) {
      const timer = setTimeout(onClose, duracion);
      return () => clearTimeout(timer);
    }
  }, [duracion, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg ${estilos.bgColor} ${estilos.borderColor} animate-slide-in`}
      role="alert"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${estilos.iconBg} flex items-center justify-center`}>
        <span className="text-lg">{estilos.icono}</span>
      </div>
      <div className="flex-1 min-w-0">
        {titulo && (
          <p className={`font-semibold ${estilos.textColor}`}>{titulo}</p>
        )}
        <p className={`text-sm ${estilos.textColor} ${titulo ? 'mt-1' : ''}`}>
          {mensaje}
        </p>
      </div>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${estilos.textColor} hover:opacity-70 transition-opacity`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

// ==================== CONTENEDOR DE NOTIFICACIONES ====================
function ContenedorNotificaciones({ notificaciones, eliminar }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
      {notificaciones.map((notif) => (
        <Toast
          key={notif.id}
          notificacion={notif}
          onClose={() => eliminar(notif.id)}
        />
      ))}
    </div>
  );
}

// ==================== PROVIDER ====================
export default function NotificacionProvider({ children }) {
  const [notificaciones, setNotificaciones] = useState([]);

  const agregar = useCallback((tipo, mensaje, titulo = null, duracion = 5000) => {
    const id = Date.now() + Math.random();
    setNotificaciones((prev) => [...prev, { id, tipo, mensaje, titulo, duracion }]);
    return id;
  }, []);

  const eliminar = useCallback((id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const limpiar = useCallback(() => {
    setNotificaciones([]);
  }, []);

  // Funciones de conveniencia
  const exito = useCallback((mensaje, titulo = 'Éxito') => {
    return agregar('SUCCESS', mensaje, titulo);
  }, [agregar]);

  const error = useCallback((mensaje, titulo = 'Error') => {
    return agregar('ERROR', mensaje, titulo, 8000);
  }, [agregar]);

  const advertencia = useCallback((mensaje, titulo = 'Advertencia') => {
    return agregar('WARNING', mensaje, titulo);
  }, [agregar]);

  const info = useCallback((mensaje, titulo = 'Información') => {
    return agregar('INFO', mensaje, titulo);
  }, [agregar]);

  const valor = {
    notificaciones,
    agregar,
    eliminar,
    limpiar,
    exito,
    error,
    advertencia,
    info,
  };

  return (
    <NotificacionContext.Provider value={valor}>
      {children}
      <ContenedorNotificaciones notificaciones={notificaciones} eliminar={eliminar} />
    </NotificacionContext.Provider>
  );
}
