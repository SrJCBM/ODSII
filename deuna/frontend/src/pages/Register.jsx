import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuthStore();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    ci: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    clearError();
    setLocalError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const { confirmPassword: _confirmPassword, ...userData } = form;
    const result = await register(userData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-purple-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <Link to="/login" className="text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <div className="text-white text-center mt-4">
          <h1 className="text-4xl font-bold mb-1">d!</h1>
          <p className="text-purple-200">Crea tu cuenta</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 py-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Registro</h2>
        
        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan"
              required
            />
            <Input
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              placeholder="Pérez"
              required
            />
          </div>

          <Input
            label="Cédula"
            name="ci"
            value={form.ci}
            onChange={handleChange}
            placeholder="0912345678"
            required
            maxLength={10}
          />

          <Input
            label="Correo electrónico"
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
            placeholder="tu@correo.com"
            required
          />

          <Input
            label="Teléfono"
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="0991234567"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            required
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            loading={loading}
            className="mt-4"
          >
            Crear cuenta
          </Button>
        </form>

        <p className="text-center mt-4 text-gray-600 text-sm pb-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-purple-700 font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
