import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./i18n/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { VetLayout } from "./layouts/VetLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import AnimalsList from "./pages/user/AnimalsList";
import AddAnimal from "./pages/user/AddAnimal";
import AnimalDetails from "./pages/user/AnimalDetails";
import HealthCheck from "./pages/user/HealthCheck";
import AIResult from "./pages/user/AIResult";
import History from "./pages/user/History";
import RiskMap from "./pages/user/RiskMap";
import RiskAnalysis from "./pages/user/RiskAnalysis";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Animals from "./pages/admin/Animals";
import Diseases from "./pages/admin/Diseases";
import Reports from "./pages/admin/Reports";
import Veterinarians from "./pages/admin/Veterinarians";
import Appointments from "./pages/admin/Appointments";
import Alerts from "./pages/admin/Alerts";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

// Vet Pages
import VetDashboard from "./pages/vet/VetDashboard";
import Patients from "./pages/vet/Patients";
import VetAppointments from "./pages/vet/VetAppointments";
import VetReports from "./pages/vet/VetReports";
import VetAlerts from "./pages/vet/VetAlerts";
import Messages from "./pages/vet/Messages";
import VetProfile from "./pages/vet/VetProfile";

// Public Pages
import LandingPage from "./pages/LandingPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.some(role => user.role === role || user.roles?.includes(role))) {
    if (user.role === 'ADMIN' || user.roles?.includes('ADMIN')) return <Navigate to="/admin/dashboard" />;
    if (user.role === 'VETERINARIAN' || user.role === 'VET' || user.roles?.includes('VETERINARIAN')) return <Navigate to="/vet/dashboard" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["USER", "FARMER"]}><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/animals" element={<AnimalsList />} />
        <Route path="/add-animal" element={<AddAnimal />} />
        <Route path="/animals/:id" element={<AnimalDetails />} />
        <Route path="/health-check" element={<HealthCheck />} />
        <Route path="/health-result/:id" element={<AIResult />} />
        <Route path="/history" element={<History />} />
        <Route path="/risk-map" element={<RiskMap />} />
        <Route path="/risk-analysis" element={<RiskAnalysis />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/animals" element={<Animals />} />
        <Route path="/admin/diseases" element={<Diseases />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/veterinarians" element={<Veterinarians />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/alerts" element={<Alerts />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* Vet Routes */}
      <Route element={<ProtectedRoute allowedRoles={["VET", "VETERINARIAN"]}><VetLayout /></ProtectedRoute>}>
        <Route path="/vet/dashboard" element={<VetDashboard />} />
        <Route path="/vet/patients" element={<Patients />} />
        <Route path="/vet/appointments" element={<VetAppointments />} />
        <Route path="/vet/reports" element={<VetReports />} />
        <Route path="/vet/alerts" element={<VetAlerts />} />
        <Route path="/vet/messages" element={<Messages />} />
        <Route path="/vet/profile" element={<VetProfile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
