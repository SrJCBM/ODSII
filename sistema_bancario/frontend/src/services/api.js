import axios from 'axios';

// ==================== CONFIGURACIÓN ====================
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
});

// ==================== CONSTANTES ====================
export const CANALES_DEPOSITO = {
  VENTANILLA: { value: 'VENTANILLA', label: 'Ventanilla', icono: '🏦' },
  CAJERO_AUTOMATICO: { value: 'CAJERO_AUTOMATICO', label: 'Cajero Automático', icono: '🏧' },
  APP_MOVIL: { value: 'APP_MOVIL', label: 'App Móvil', icono: '📱' },
  BANCA_WEB: { value: 'BANCA_WEB', label: 'Banca Web', icono: '💻' },
  CORRESPONSAL: { value: 'CORRESPONSAL', label: 'Corresponsal', icono: '🏪' },
};

export const TIPOS_DEPOSITO = {
  EFECTIVO: { value: 'EFECTIVO', label: 'Efectivo', icono: '💵' },
  CHEQUE: { value: 'CHEQUE', label: 'Cheque', icono: '📝' },
  TRANSFERENCIA: { value: 'TRANSFERENCIA', label: 'Transferencia', icono: '🔄' },
};

export const ESTADOS_DEPOSITO = {
  PENDIENTE: { value: 'PENDIENTE', label: 'Pendiente', color: 'yellow' },
  PROCESADO: { value: 'PROCESADO', label: 'Procesado', color: 'green' },
  RECHAZADO: { value: 'RECHAZADO', label: 'Rechazado', color: 'red' },
};

// ==================== API DEPÓSITOS ====================
export const depositosApi = {
  listar: (params = {}) => api.get('/depositos/', { params }),
  obtener: (id) => api.get(`/depositos/${id}`),
  crear: (data) => api.post('/depositos/', data),
  actualizar: (id, data) => api.put(`/depositos/${id}`, data),
  eliminar: (id) => api.delete(`/depositos/${id}`),
  estadisticas: () => api.get('/depositos/estadisticas/resumen'),
};

// ==================== API CUENTAS ====================
export const cuentasApi = {
  listar: (params = {}) => api.get('/cuentas/', { params }),
  obtener: (id) => api.get(`/cuentas/${id}`),
  validar: (numeroCuenta) => api.get(`/cuentas/validar/${numeroCuenta}`),
};

// ==================== API CAJEROS ====================
export const cajerosApi = {
  listar: () => api.get('/cajeros/'),
};

export default api;
