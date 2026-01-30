import { useContext } from 'react';
import { NotificacionContext } from './NotificacionContext';

/**
 * Hook para acceder al sistema de notificaciones
 * @returns {Object} Funciones para mostrar notificaciones: exito, error, advertencia, info
 */
export function useNotificacion() {
  const context = useContext(NotificacionContext);
  if (!context) {
    throw new Error('useNotificacion debe usarse dentro de NotificacionProvider');
  }
  return context;
}
