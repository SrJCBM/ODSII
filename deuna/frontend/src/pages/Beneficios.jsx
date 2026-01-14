import BottomNav from '../components/BottomNav';

export default function Beneficios() {
  const promociones = [
    {
      id: 1,
      titulo: '10% de descuento',
      descripcion: 'En tus primeras 3 compras con QR',
      color: 'from-purple-500 to-purple-700',
      emoji: '🎉',
    },
    {
      id: 2,
      titulo: 'Cashback del 5%',
      descripcion: 'En restaurantes seleccionados',
      color: 'from-green-500 to-green-700',
      emoji: '🍔',
    },
    {
      id: 3,
      titulo: 'Envío gratis',
      descripcion: 'Con LoTienesDeuna y Marcimex',
      color: 'from-orange-500 to-orange-700',
      emoji: '📦',
    },
    {
      id: 4,
      titulo: '2x1 en cines',
      descripcion: 'Todos los martes',
      color: 'from-blue-500 to-blue-700',
      emoji: '🎬',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-purple-700 px-4 py-6">
        <h1 className="text-white text-xl font-bold">Beneficios</h1>
        <p className="text-purple-200 mt-1">Descubre todas tus promociones</p>
      </div>

      {/* Banner */}
      <div className="px-4 -mt-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">¡Invita y gana!</p>
              <p className="font-bold text-lg">$5 por cada amigo</p>
              <p className="text-sm opacity-90">que se registre con tu código</p>
            </div>
            <span className="text-4xl">🎁</span>
          </div>
        </div>
      </div>

      {/* Promociones */}
      <div className="px-4 py-6">
        <h2 className="font-semibold text-gray-900 mb-4">Mis promociones</h2>
        <div className="grid grid-cols-2 gap-3">
          {promociones.map((promo) => (
            <div
              key={promo.id}
              className={`bg-gradient-to-br ${promo.color} rounded-xl p-4 text-white`}
            >
              <span className="text-3xl">{promo.emoji}</span>
              <h3 className="font-bold mt-2">{promo.titulo}</h3>
              <p className="text-sm opacity-90">{promo.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aliados */}
      <div className="px-4 py-4">
        <h2 className="font-semibold text-gray-900 mb-4">Comercios aliados</h2>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="grid grid-cols-4 gap-4">
            {['🏪', '🍕', '☕', '👕', '🎮', '💊', '🛒', '⛽'].map((icon, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                  {icon}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-purple-700 font-medium text-sm">
            Ver todos los comercios →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
