// Enmascara el número de cuenta: "2847593826" → "******3826"
export const mascararCuenta = (numero) => {
  if (!numero) return '';
  return '******' + numero.slice(-4);
};

// Formatea el monto como moneda
export const formatMonto = (monto) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(monto);
};

// Formatea fecha
export const formatFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(fecha));
};

// Obtiene iniciales del nombre
export const getIniciales = (nombre, apellido) => {
  const n = nombre?.charAt(0)?.toUpperCase() || '';
  const a = apellido?.charAt(0)?.toUpperCase() || '';
  return n + a;
};

// Genera un color basado en el string (para avatares)
export const stringToColor = (str) => {
  if (!str) return '#5B21B6';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#5B21B6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];
  return colors[Math.abs(hash) % colors.length];
};
