import React from "react";
import {
  IResourceComponentsProps,
  useShow,
} from "@refinedev/core";
import {
  Show,
  TagField,
  TextField,
  BooleanField,
} from "@refinedev/antd";
import { Typography, Space, Divider, Card, Badge, Button, Image, Alert, QRCode } from "antd";
import { 
  WifiOutlined, 
  LockOutlined, 
  UnlockOutlined, 
  QrcodeOutlined, 
  CalendarOutlined, 
  EditOutlined,
  CopyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import type { WifiNetwork } from "../../types/wifi";

const { Title, Text, Paragraph } = Typography;

export const WifiShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<WifiNetwork>();
  const { data, isLoading } = queryResult;
  const [showPassword, setShowPassword] = React.useState(false);
  const [qrModalVisible, setQrModalVisible] = React.useState(false);

  const record = data?.data;

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    // Aquí podrías agregar una notificación de éxito
  };

  return (
    <Show isLoading={isLoading}>
      {record && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Encabezado Principal */}
          <Card>
            <Space align="start" size="large">
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12, 
                backgroundColor: record.isActive ? '#52c41a' : '#d9d9d9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                color: 'white'
              }}>
                <WifiOutlined />
              </div>
              
              <Space direction="vertical" size="small" style={{ flex: 1 }}>
                <Title level={2} style={{ margin: 0 }}>
                  <Space>
                    <TextField value={record.networkName} />
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(record.networkName, 'Nombre de red')}
                      title="Copiar nombre de red"
                    />
                  </Space>
                </Title>
                
                <Space size="middle" wrap>
                  <BooleanField
                    value={record.isActive}
                    trueIcon={<Badge status="success" text="Red Activa" />}
                    falseIcon={<Badge status="default" text="Red Inactiva" />}
                  />
                  
                  <Badge 
                    color={record.password ? 'orange' : 'green'}
                    text={record.password ? 'Red Protegida' : 'Red Abierta'}
                  />
                  
                  {record.qrCode && (
                    <Badge color="blue" text="Código QR Disponible" />
                  )}
                </Space>

                {record.description && (
                  <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                    <TextField value={record.description} />
                  </Paragraph>
                )}
              </Space>
            </Space>
          </Card>

          {/* Información de Conexión */}
          <Card title={<><WifiOutlined /> Información de Conexión</>}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Nombre de la Red (SSID):</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Text code copyable style={{ fontSize: '16px' }}>
                      {record.networkName}
                    </Text>
                    <Button
                      type="link"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(record.networkName, 'Nombre de red')}
                    >
                      Copiar
                    </Button>
                  </Space>
                </div>
              </div>

              {record.password && (
                <div>
                  <Text strong>Contraseña:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <Text code style={{ fontSize: '16px' }}>
                        {showPassword ? record.password : '••••••••••••'}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        icon={showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </Button>
                      {showPassword && (
                        <Button
                          type="link"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(record.password!, 'Contraseña')}
                        >
                          Copiar
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              )}

              <div>
                <Text strong>Tipo de Seguridad:</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    {record.password ? (
                      <><LockOutlined style={{ color: '#fa8c16' }} /> WPA/WPA2</>
                    ) : (
                      <><UnlockOutlined style={{ color: '#52c41a' }} /> Abierta (Sin contraseña)</>
                    )}
                  </Space>
                </div>
              </div>

              <div>
                <Text strong>Estado de la Red:</Text>
                <div style={{ marginTop: 8 }}>
                  <BooleanField
                    value={record.isActive}
                    trueIcon={
                      <Space>
                        <Badge status="success" />
                        <Text style={{ color: '#52c41a' }}>Activa y disponible para conexión</Text>
                      </Space>
                    }
                    falseIcon={
                      <Space>
                        <Badge status="default" />
                        <Text style={{ color: '#d9d9d9' }}>Inactiva - No disponible para nuevas conexiones</Text>
                      </Space>
                    }
                  />
                </div>
              </div>
            </Space>
          </Card>

          {/* Código QR */}
          {record.qrCode && (
            <Card title={<><QrcodeOutlined /> Código QR para Conexión Rápida</>}>
              <Space direction="vertical" align="center" style={{ width: "100%" }}>
                <Image
                  src={record.qrCode}
                  alt={`QR Code - ${record.networkName}`}
                  width={200}
                  height={200}
                  style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
                />
                
                <Alert
                  message="Instrucciones de uso"
                  description={
                    <div>
                      <p>1. Abre la cámara de tu dispositivo móvil</p>
                      <p>2. Enfoca el código QR mostrado arriba</p>
                      <p>3. Toca la notificación que aparece para conectarte automáticamente</p>
                      <p>4. Tu dispositivo se conectará sin necesidad de escribir la contraseña</p>
                    </div>
                  }
                  type="info"
                  showIcon
                />

                <Space>
                  <Button
                    type="primary"
                    icon={<QrcodeOutlined />}
                    onClick={() => setQrModalVisible(true)}
                  >
                    Ver QR en Pantalla Completa
                  </Button>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(record.qrCode!, 'Código QR')}
                  >
                    Copiar Código Base64
                  </Button>
                </Space>
              </Space>
            </Card>
          )}

          {/* Información de Auditoría */}
          <Card title="Información de Auditoría">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space size="large" wrap>
                <Space direction="vertical" size="small">
                  <Text strong>
                    <CalendarOutlined /> Fecha de Creación:
                  </Text>
                  <Text type="secondary">
                    {new Date(record.createdAt).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Space>

                <Space direction="vertical" size="small">
                  <Text strong>
                    <EditOutlined /> Última Actualización:
                  </Text>
                  <Text type="secondary">
                    {new Date(record.updatedAt).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Space>
              </Space>
            </Space>
          </Card>

          {/* Información Técnica */}
          <Card title="Información Técnica">
            <Space direction="vertical" size="small">
              <div>
                <Text strong>ID de la Red:</Text>
                <Text code copyable style={{ marginLeft: 8 }}>
                  {record.id}
                </Text>
              </div>
              
              {record.qrCode && (
                <div>
                  <Text strong>Formato del QR:</Text>
                  <Text style={{ marginLeft: 8 }}>
                    Imagen Base64 ({record.qrCode.length} caracteres)
                  </Text>
                </div>
              )}

              <div>
                <Text strong>Configuración JSON:</Text>
                <div style={{ marginTop: 8 }}>
                  <Text code copyable={{ text: JSON.stringify({
                    ssid: record.networkName,
                    password: record.password || null,
                    security: record.password ? 'WPA' : 'nopass',
                    hidden: false
                  }, null, 2) }}>
                    Ver configuración completa
                  </Text>
                </div>
              </div>
            </Space>
          </Card>

          {!record.isActive && (
            <Alert
              message="Red Inactiva"
              description="Esta red WiFi está marcada como inactiva. Los dispositivos no podrán conectarse hasta que sea reactivada."
              type="warning"
              showIcon
            />
          )}
        </Space>
      )}
    </Show>
  );
};
