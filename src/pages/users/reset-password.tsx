import { Edit } from "@refinedev/antd";
import { useNotification, useCustomMutation } from "@refinedev/core";
import { useState } from "react";
import { Button, Form, Input, Card, Typography, Empty } from "antd";
import { useParams, useNavigate } from "react-router";
import { CloseOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export const UsersResetPassword = () => {
  const { open } = useNotification();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm<ResetPasswordForm>();

  const userId = params?.id;

  const { mutate: resetPassword, isPending } = useCustomMutation();

  const handleResetPassword = async (values: ResetPasswordForm) => {
    if (!userId) {
      open?.({
        type: "error",
        message: "Error",
        description: "ID de usuario no válido",
      });
      return;
    }

    resetPassword(
      {
        url: `/users/${userId}/reset-password`,
        method: "patch",
        values: { newPassword: values.newPassword },
      },
      {
        onSuccess: () => {
          open?.({
            type: "success",
            message: "Contraseña reiniciada",
            description: "La contraseña ha sido reiniciada exitosamente",
          });
          navigate("/users");
        },
        onError: (error) => {
          console.error("Error resetting password:", error);
          open?.({
            type: "error",
            message: "Error",
            description: "No se pudo reiniciar la contraseña",
          });
        },
      }
    );
  };

  return (
    <Edit
      title="Reiniciar Contraseña"
      saveButtonProps={{
        loading: isPending,
        onClick: () => form.submit(),
        icon: <LockOutlined />,
        children: "Reiniciar Contraseña"
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <Button onClick={() => navigate("/users")}>
            Cancelar
          </Button>
        </>
      )}
    >
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <UserOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          <Title level={4} style={{ marginTop: 16 }}>
            Reiniciar Contraseña de Usuario
          </Title>
          <Text type="secondary">
            Ingresa una nueva contraseña para el usuario
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
          autoComplete="off"
        >
          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: "Por favor ingresa la nueva contraseña" },
              { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Ingresa la nueva contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Por favor confirma la contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirma la nueva contraseña"
              size="large"
            />
          </Form.Item>
        </Form>
      </Card>
    </Edit>
  );
};
