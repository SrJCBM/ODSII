import axios from 'axios';

// En producción usar la URL del backend de Render, en desarrollo usar el proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (correo, password) => api.post('/auth/login', { correo, password }),
  register: (userData) => api.post('/auth/register', userData),
};

// Usuario
export const usuarioAPI = {
  getMe: () => api.get('/usuarios/me').then(res => ({ data: res.data.usuario })),
  getByQR: (codigo) => api.get(`/usuarios/qr/${codigo}`).then(res => ({ data: res.data.usuario })),
};

// Pagos
export const pagoAPI = {
  pagarQR: (receptor_qr, monto, descripcion) => 
    api.post('/pagos/qr', { receptor_qr, monto, descripcion }),
};

// Transacciones
export const transaccionAPI = {
  getAll: () => api.get('/transacciones').then(res => ({ data: res.data.transacciones || [] })),
};

export default api;
