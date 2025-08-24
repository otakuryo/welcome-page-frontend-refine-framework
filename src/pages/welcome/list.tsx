import { usePermissions } from "@refinedev/core";
import { Welcome } from "../../components/welcome";

export const WelcomePage = () => {
  const { data: permissions } = usePermissions();
  
  // Todos los usuarios autenticados pueden acceder a esta página
  return <Welcome />;
};
