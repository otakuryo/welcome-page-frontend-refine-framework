import type { UserRole } from "../../../types/users";

export type RoleOption = {
    label: string;
    value: UserRole;
}

export const roleOptions: RoleOption[] = [
    { label: "Administrador", value: "ADMIN" },
    { label: "CEO", value: "CEO" },
    { label: "RRHH", value: "RRHH" },
    { label: "Jefe de Departamento", value: "JEFE_DEPARTAMENTO" },
    { label: "Usuario", value: "USUARIO" },
  ];