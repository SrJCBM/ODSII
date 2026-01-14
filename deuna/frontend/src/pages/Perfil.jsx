import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import { mascararCuenta, formatMonto } from '../utils/helpers';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: '👤', label: 'Datos personales', path: '/perfil/datos' },
    { icon: '🔒', label: 'Seguridad', path: '/perfil/seguridad' },
    { icon: '🔔', label: 'Notificaciones', path: '/perfil/notificaciones' },
    { icon: '❓', label: 'Ayuda', path: '/perfil/ayuda' },
    { icon: '📄', label: 'Términos y condiciones', path: '/perfil/terminos' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-purple-700 px-4 py-8">
        <div className="flex items-center gap-4">
          <Avatar nombre={user?.nombre} apellido={user?.apellido} size="xl" />
          <div className="text-white">
            <h1 className="text-xl font-bold">{user?.nombre} {user?.apellido}</h1>
            <p className="text-purple-200">{user?.correo}</p>
            <p className="text-purple-200 text-sm">
              Cuenta: {mascararCuenta(user?.numero_cuenta)}
            </p>
          </div>
        </div>
      </div>

      {/* Saldos */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Mis saldos</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-purple-700 font-bold text-lg">d!</span>
                <span className="text-gray-700">Saldo Deuna</span>
              </div>
              <span className="font-bold text-purple-700">
                {formatMonto(user?.saldo_deuna || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-green-700 font-bold">BP</span>
                <span className="text-gray-700">Banco Pichincha</span>
              </div>
              <span className="font-bold text-green-700">
                {formatMonto(user?.saldo_bp || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-700">{item.label}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 py-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-gray-400 text-sm py-4">
        Deuna Clone v1.0.0 - Proyecto Educativo
      </p>

      <BottomNav />
    </div>
  );
}
