import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages/admin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-right" />
        <Routes>
          {/* Routes publiques - redirigent si déjà connecté */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />

          {/* Routes protégées - nécessitent authentification */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="client">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Route 404 - redirection vers login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
