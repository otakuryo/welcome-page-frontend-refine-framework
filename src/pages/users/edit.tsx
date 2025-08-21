import { Edit, useForm } from "@refinedev/antd";
import { usePermissions, useOne } from "@refinedev/core";
import { Form, Input, Select, Switch, Divider } from "antd";
import { useMemo, useEffect } from "react";
import { useParams } from "react-router";
import type { UserDetailed } from "../../types/users";
import { roleOptions } from "./models/RoleOptions";

// Tipo extendido para el formulario que incluye campos de información personal al nivel superior
interface UserFormData extends UserDetailed {
  phone?: string;
  department?: string;
  position?: string;
  startDate?: string;
  birthDate?: string;
  emergencyContact?: string;
  currentMachine?: string;
}

export const UsersEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: permissions } = usePermissions();
  const canManage = useMemo(() => permissions === "ADMIN" || permissions === "CEO" || permissions === "RRHH", [permissions]);

  // Obtener datos del usuario para mapear información personal
  const { data: userData } = useOne<UserDetailed>({
    resource: "users",
    id: id!,
  });

  const { formProps, saveButtonProps, form } = useForm<UserFormData>({
    redirect: "list",
    resource: "users",
    action: "edit",
    defaultFormValues: {
      role: "USUARIO",
      isActive: true,
    }
  });

  // Mapear información personal al nivel superior del formulario cuando se cargan los datos
  useEffect(() => {
    if (userData?.data && form) {
      const user = userData.data;
      const formData: Partial<UserFormData> = {
        ...user,
        // Mapear campos de información personal disponibles en UserPersonalInfoLite
        department: user.personalInfo?.department || undefined,
        position: user.personalInfo?.position || undefined,
        startDate: user.personalInfo?.startDate || undefined,
        currentMachine: user.personalInfo?.currentMachine || undefined,
        // Los campos phone, birthDate y emergencyContact se dejarán vacíos hasta que se obtengan
        phone: undefined,
        birthDate: undefined,
        emergencyContact: undefined,
      };
      
      form.setFieldsValue(formData);
    }
  }, [userData, form]);

  if (!canManage) {
    return <div>No tienes permisos para editar usuarios.</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Divider orientation="left">Información Básica</Divider>
        
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Usuario" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Nombre" name="firstName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Apellido" name="lastName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        
        <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
          <Select options={roleOptions} style={{ width: 240 }} />
        </Form.Item>
        
        <Form.Item label="Estado Activo" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
        </Form.Item>

        <Divider orientation="left">Información Personal</Divider>
        
        {/* <Form.Item label="Teléfono" name="phone">
          <Input placeholder="Ej: +1234567890" />
        </Form.Item> */}
        
        <Form.Item label="Departamento" name="department">
          <Input placeholder="Ej: Desarrollo, RRHH, Ventas" />
        </Form.Item>
        
        <Form.Item label="Cargo/Posición" name="position">
          <Input placeholder="Ej: Desarrollador Senior, Gerente" />
        </Form.Item>
        
        {/* <Form.Item label="Fecha de Nacimiento" name="birthDate">
          <DatePicker style={{ width: '100%' }} placeholder="Selecciona fecha de nacimiento" />
        </Form.Item> */}
        
        {/* <Form.Item label="Contacto de Emergencia" name="emergencyContact">
          <Input placeholder="Nombre y teléfono del contacto de emergencia" />
        </Form.Item> */}
        
        <Form.Item label="Máquina Actual" name="currentMachine">
          <Input placeholder="Ej: Laptop Dell XPS, PC-DEV-001" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
