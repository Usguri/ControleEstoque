import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import Login from "./pages/Index";
import TelaPrincipal from "./pages/TelaPrincipal";
import TelaPrincipalCliente from "./pages/TelaPrincipalCliente";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/Login" />} />

    <Route
      path="/Login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />

    <Route
      path="/Tela-principal"
      element={
        <ProtectedRoute allowedRoles={[1]}>
          <TelaPrincipal />
        </ProtectedRoute>
      }
    />

    <Route
      path="/Tela-principal-cliente"
      element={
        <ProtectedRoute allowedRoles={[2]}>
          <TelaPrincipalCliente />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRouter;
