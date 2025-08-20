import { Edit } from "@refinedev/antd";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Select, Switch, message } from "antd";
import { useParams } from "react-router";
import { ApiService } from "../../services/apiService";
import { UsersService } from "../../services/usersService";
import type { UpdatePersonalInfoRequest, UpdateRoleRequest, UpdateStatusRequest, UserDetailed, UserRole } from "../../types/users";
import { AuthService } from "../../services/authService";
import { usePermissions } from "@refinedev/core";
import { roleOptions } from "./models/RoleOptions";

const api = new ApiService();
const usersService = new UsersService(api);
const authService = new AuthService(api);

export const UsersEdit = () => {

  const { data: permissions } = usePermissions();
  const canManage = useMemo(() => permissions === "ADMIN" || permissions === "CEO" || permissions === "RRHH", [permissions]);

  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<UserDetailed | null>(null);
  const [form] = Form.useForm<UpdatePersonalInfoRequest>();

  const token = authService.getToken() || undefined;

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await usersService.getUserById(params.id as string, token);
        setRecord(res.data);
        form.setFieldsValue({
          department: res.data.personalInfo?.department || undefined,
          position: res.data.personalInfo?.position || undefined,
          startDate: res.data.personalInfo?.startDate || undefined,
          currentMachine: res.data.personalInfo?.currentMachine || undefined,
        });
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetch();
  }, [params.id]);

  const handleSavePersonal = async () => {
    const values = await form.validateFields();
    await usersService.updatePersonalInfo(params.id as string, values, token);
    message.success("Información personal actualizada");
  };

  const handleChangeRole = async (role: UserRole) => {
    const body: UpdateRoleRequest = { role };
    await usersService.updateRole(params.id as string, body, token);
    message.success("Rol actualizado");
  };

  const handleChangeStatus = async (checked: boolean) => {
    const body: UpdateStatusRequest = { isActive: checked };
    await usersService.updateStatus(params.id as string, body, token);
    message.success("Estado actualizado");
  };

  return (
    <Edit isLoading={loading} title="Editar usuario">
      {!canManage ? (
        <div>No tienes permisos para editar usuarios.</div>
      ) : (
        <>
          <Form layout="vertical" form={form} onFinish={handleSavePersonal}>
            <Form.Item label="Departamento" name="department">
              <Input />
            </Form.Item>
            <Form.Item label="Cargo" name="position">
              <Input />
            </Form.Item>
            <Form.Item label="Fecha de inicio (ISO)" name="startDate">
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Máquina actual" name="currentMachine">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Guardar</Button>
            </Form.Item>
          </Form>

          <Form layout="vertical" style={{ marginTop: 24 }}>
            <Form.Item label="Rol">
              <Select
                style={{ width: 240 }}
                options={roleOptions}
                value={record?.role as UserRole}
                onChange={handleChangeRole}
              />
            </Form.Item>
            <Form.Item label="Activo">
              <Switch checked={record?.isActive} onChange={handleChangeStatus} />
            </Form.Item>
          </Form>
        </>
      )}
    </Edit>
  );
};


