import { usePermissions } from "@refinedev/core";
import { Navigate } from "react-router";

export const PermissionBasedRedirect = () => {
  const { data: permissions } = usePermissions();
  
  // Todos los usuarios autenticados van a la página de bienvenida
  // Desde allí pueden acceder al panel de administración si tienen permisos
  return <Navigate to="/welcome" replace />;
};
