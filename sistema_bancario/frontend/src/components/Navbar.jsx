import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-yellow-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            {/* Logo Banco Pichincha */}
            <img src="/Logo Banco.jpg" alt="Banco Pichincha" className="h-10 w-10 object-contain" />
            <span className="text-blue-900 font-bold text-xl">Banco Pichincha</span>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-900 hover:bg-yellow-400'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/depositos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/depositos') 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-900 hover:bg-yellow-400'
              }`}
            >
              Depósitos
            </Link>
            <Link
              to="/depositos/nuevo"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/depositos/nuevo') 
                  ? 'bg-blue-900 text-white' 
                  : 'text-blue-900 hover:bg-yellow-400'
              }`}
            >
              Nuevo Depósito
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
