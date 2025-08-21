import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Upload, Button, Space, Alert } from "antd";
import { UploadOutlined, WifiOutlined, QrcodeOutlined } from "@ant-design/icons";
import type { CreateWifiNetworkRequest } from "../../types/wifi";

const { TextArea } = Input;
const { Password } = Input;

export const WifiCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, form } = useForm<CreateWifiNetworkRequest>();

  const [hasPassword, setHasPassword] = React.useState(true);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Alert
          message="Nueva Red WiFi"
          description="Configure una nueva red WiFi para el sistema. La red se creará en estado activo por defecto."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

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
              onChange={setHasPassword}
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

        <Form.Item>
          <Alert
            message="Información sobre el Código QR"
            description={
              <div>
                <p>• El código QR debe ser una imagen en formato base64</p>
                <p>• Puede generar el QR usando herramientas online o aplicaciones específicas</p>
                <p>• El QR debe contener la información de conexión WiFi (SSID, contraseña, tipo de seguridad)</p>
                <p>• Es opcional, pero facilita la conexión de dispositivos móviles</p>
              </div>
            }
            type="info"
            showIcon
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <span style={{ color: "#666", fontSize: "14px" }}>
              💡 La red se creará en estado activo y estará disponible inmediatamente
            </span>
          </Space>
        </Form.Item>
      </Form>
    </Create>
  );
};
