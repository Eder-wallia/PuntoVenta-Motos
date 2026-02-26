import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterMoto from './pages/RegisterMoto';
import VehiclesList from './pages/VehiclesList';
import RegisterWork from './pages/RegisterWork';
import VehiclesHistory from './pages/VehiclesHistory';
import { withAuth } from './components/withAuth';
import './App.css';

// Proteger rutas con HOC
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedRegisterMoto = withAuth(RegisterMoto);
const ProtectedVehiclesList = withAuth(VehiclesList);
const ProtectedRegisterWork = withAuth(RegisterWork);
const ProtectedVehiclesHistory = withAuth(VehiclesHistory);

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/register-moto" element={<ProtectedRegisterMoto />} />
        <Route path="/vehicles" element={<ProtectedVehiclesList />} />
        <Route path="/register-work/:vehicleId" element={<ProtectedRegisterWork />} />
        <Route path="/history/:vehicleId" element={<ProtectedVehiclesHistory />} />

        {/* Redirigir raíz a dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App
