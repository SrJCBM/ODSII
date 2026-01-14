import { getIniciales, stringToColor } from '../utils/helpers';

export default function Avatar({ nombre, apellido, size = 'md', className = '' }) {
  const iniciales = getIniciales(nombre, apellido);
  const bgColor = stringToColor(nombre + apellido);
  
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {iniciales}
    </div>
  );
}
