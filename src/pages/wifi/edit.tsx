import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Space, Alert, Tag } from "antd";
import { WifiOutlined, QrcodeOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import type { UpdateWifiNetworkRequest, WifiNetwork } from "../../types/wifi";

const { TextArea } = Input;
const { Password } = Input;

export const WifiEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult, form } = useForm<WifiNetwork, {}, UpdateWifiNetworkRequest>();
  
  const wifiData = queryResult?.data?.data;
  const [hasPassword, setHasPassword] = React.useState(!!wifiData?.password);

  React.useEffect(() => {
    if (wifiData) {
      setHasPassword(!!wifiData.password);
    }
  }, [wifiData]);

  const handlePasswordToggle = (checked: boolean) => {
    setHasPassword(checked);
    if (!checked) {
      // Si se desactiva la contraseña, limpiar el campo
      form?.setFieldValue('password', null);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {wifiData && (
          <Alert
            message="Información de la Red WiFi"
            description={
              <Space direction="vertical" size={4}>
                <span><strong>ID:</strong> {wifiData.id}</span>
                <span><strong>Creado:</strong> {new Date(wifiData.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
                <span><strong>Última actualización:</strong> {new Date(wifiData.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
                <Space>
                  <strong>Estado actual:</strong>
                  <Tag color={wifiData.isActive ? 'success' : 'default'}>
                    {wifiData.isActive ? 'Activa' : 'Inactiva'}
                  </Tag>
                  <Tag color={wifiData.password ? 'orange' : 'green'}>
                    {wifiData.password ? <><LockOutlined /> Protegida</> : <><UnlockOutlined /> Abierta</>}
                  </Tag>
                  {wifiData.qrCode && <Tag color="blue">📱 Con QR</Tag>}
                </Space>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          label="Nombre de la Red"
          name="networkName"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de la red WiFi",
            },
            {
              min: 2,
              message: "El nombre debe tener al menos 2 caracteres",
            },
            {
              max: 50,
              message: "El nombre no puede exceder los 50 caracteres",
            },
            {
              pattern: /^[a-zA-Z0-9_\-\s]+$/,
              message: "El nombre solo puede contener letras, números, guiones y espacios",
            },
          ]}
        >
          <Input 
            placeholder="ADN_Oficina_WiFi"
            prefix={<WifiOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[
            {
              max: 500,
              message: "La descripción no puede exceder los 500 caracteres",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Descripción de la red WiFi (ej: Red principal para empleados)"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <span>¿La red tiene contraseña?</span>
            <Switch
              checked={hasPassword}
              onChange={handlePasswordToggle}
              checkedChildren="Sí"
              unCheckedChildren="No"
            />
          </Space>
        </Form.Item>

        {hasPassword && (
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              {
                required: hasPassword,
                message: "Por favor ingresa la contraseña de la red WiFi",
              },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              {
                max: 100,
                message: "La contraseña no puede exceder los 100 caracteres",
              },
            ]}
          >
            <Password
              placeholder="Contraseña segura de la red WiFi"
              visibilityToggle
            />
          </Form.Item>
        )}

        <Form.Item
          label="Código QR"
          name="qrCode"
          rules={[
            {
              pattern: /^data:image\/(png|jpeg|jpg|gif|webp);base64,/,
              message: "El código QR debe ser una imagen válida en formato base64",
            },
          ]}
        >
          <Input.TextArea
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk..."
            rows={6}
            prefix={<QrcodeOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Estado de la Red"
          name="isActive"
          valuePropName="checked"
          tooltip="Desactivar una red la oculta para los usuarios finales pero mantiene su configuración"
        >
          <Switch
            checkedChildren="Activa"
            unCheckedChildren="Inactiva"
          />
        </Form.Item>

        <Form.Item>
          <Alert
            message="Notas importantes"
            description={
              <div>
                <p>• Cambiar la contraseña no actualiza automáticamente el código QR</p>
                <p>• Si modificas la contraseña, considera generar un nuevo código QR</p>
                <p>• Desactivar la red la oculta temporalmente sin eliminar la configuración</p>
                <p>• Los cambios se aplicarán inmediatamente después de guardar</p>
              </div>
            }
            type="warning"
            showIcon
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
