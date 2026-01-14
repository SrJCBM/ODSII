import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PagarQR from './pages/PagarQR';
import ConfirmarPago from './pages/ConfirmarPago';
import Cobrar from './pages/Cobrar';
import Recargar from './pages/Recargar';
import Billetera from './pages/Billetera';
import Beneficios from './pages/Beneficios';
import Perfil from './pages/Perfil';

function AppLayout({ children }) {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white relative">
      {children}
      <BottomNav />
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagar-qr"
          element={
            <ProtectedRoute>
              <PagarQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmar-pago"
          element={
            <ProtectedRoute>
              <ConfirmarPago />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cobrar"
          element={
            <ProtectedRoute>
              <Cobrar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recargar"
          element={
            <ProtectedRoute>
              <Recargar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billetera"
          element={
            <ProtectedRoute>
              <Billetera />
            </ProtectedRoute>
          }
        />
        <Route
          path="/beneficios"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Beneficios />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
