import { Create, useForm } from "@refinedev/antd";
import { usePermissions } from "@refinedev/core";
import { Form, Input, Select } from "antd";
import { useMemo } from "react";
import type { CreateUserRequest } from "../../types/users";
import { roleOptions } from "./models/RoleOptions";

export const UsersCreate = () => {
  const { data: permissions } = usePermissions();
  const canManage = useMemo(() => permissions === "ADMIN" || permissions === "CEO" || permissions === "RRHH", [permissions]);

  const { formProps, saveButtonProps } = useForm<CreateUserRequest>({
    redirect: "list",
    resource: "users",
    action: "create",
    defaultFormValues: {
      role: "USUARIO",
    }
  });

  if (!canManage) {
    return <div>No tienes permisos para crear usuarios.</div>;
  }

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
        <Form.Item label="Contraseña" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item label="Rol" name="role" rules={[{ required: true }]}>
          <Select options={roleOptions} style={{ width: 240 }} />
        </Form.Item>
      </Form>
    </Create>
  );
};


