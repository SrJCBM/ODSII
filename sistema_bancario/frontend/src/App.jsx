import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotificacionProvider from './components/NotificacionProvider';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ListaDepositos from './pages/ListaDepositos';
import NuevoDeposito from './pages/NuevoDeposito';

function App() {
  return (
    <Router>
      <NotificacionProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/depositos" element={<ListaDepositos />} />
              <Route path="/depositos/nuevo" element={<NuevoDeposito />} />
            </Routes>
          </main>
        </div>
      </NotificacionProvider>
    </Router>
  );
}

export default App;
