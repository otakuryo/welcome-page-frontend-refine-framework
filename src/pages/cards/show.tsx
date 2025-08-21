import React from "react";
import {
  IResourceComponentsProps,
  useShow,
  useOne,
} from "@refinedev/core";
import {
  Show,
  NumberField,
  TagField,
  TextField,
  BooleanField,
  EmailField,
} from "@refinedev/antd";
import { Typography, Space, Divider, Card, Avatar, Badge, Button, Image } from "antd";
import { LinkOutlined, UserOutlined, CalendarOutlined, EditOutlined } from "@ant-design/icons";
import type { FullCard, CardType } from "../../types/cards";

const { Title, Text, Paragraph } = Typography;

const cardTypeColors: Record<CardType, string> = {
  ERP: "blue",
  CONTROL_TIEMPOS: "green",
  PROGRAMAS: "purple",
  GESTOR_PASSWORDS: "red",
  INFORMACION_PERSONAL: "orange",
  CALENDARIOS: "cyan",
  MAQUINA_ACTUAL: "magenta",
  WIFI: "lime",
  ENLACES: "gold",
};

const cardTypeLabels: Record<CardType, string> = {
  ERP: "ERP",
  CONTROL_TIEMPOS: "Control de Tiempos",
  PROGRAMAS: "Programas",
  GESTOR_PASSWORDS: "Gestor de Contraseñas",
  INFORMACION_PERSONAL: "Información Personal",
  CALENDARIOS: "Calendarios",
  MAQUINA_ACTUAL: "Máquina Actual",
  WIFI: "WiFi",
  ENLACES: "Enlaces",
};

export const CardsShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow<FullCard>();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      {record && (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Encabezado Principal */}
          <Card>
            <Space align="start" size="large">
              {record.imageUrl ? (
                <Image
                  src={record.imageUrl}
                  alt={record.title}
                  width={80}
                  height={80}
                  style={{ borderRadius: 8, objectFit: 'cover' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              ) : (
                <Avatar
                  size={80}
                  shape="square"
                  style={{ backgroundColor: cardTypeColors[record.type] }}
                  icon={<UserOutlined />}
                />
              )}
              
              <Space direction="vertical" size="small" style={{ flex: 1 }}>
                <Title level={2} style={{ margin: 0 }}>
                  <TextField value={record.title} />
                </Title>
                
                <Space size="middle">
                  <TagField
                    value={cardTypeLabels[record.type]}
                    color={cardTypeColors[record.type]}
                  />
                  
                  <BooleanField
                    value={record.isActive}
                    trueIcon={<Badge status="success" text="Activo" />}
                    falseIcon={<Badge status="default" text="Inactivo" />}
                  />
                  
                  <Badge count={record.sortOrder} color="blue" />
                </Space>

                {record.linkUrl && (
                  <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    href={record.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ir al Enlace
                  </Button>
                )}
              </Space>
            </Space>
          </Card>

          {/* Información Detallada */}
          <Card title="Información Detallada">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {record.description && (
                <div>
                  <Text strong>Descripción:</Text>
                  <Paragraph style={{ marginTop: 8 }}>
                    <TextField value={record.description} />
                  </Paragraph>
                </div>
              )}

              <Divider />

              <Space direction="vertical" size="small">
                <Text strong>Tipo de Tarjeta:</Text>
                <TagField
                  value={cardTypeLabels[record.type]}
                  color={cardTypeColors[record.type]}
                />
              </Space>

              <Space direction="vertical" size="small">
                <Text strong>Orden de Clasificación:</Text>
                <NumberField
                  value={record.sortOrder}
                  options={{
                    style: "decimal",
                  }}
                />
              </Space>

              <Space direction="vertical" size="small">
                <Text strong>Estado:</Text>
                <BooleanField
                  value={record.isActive}
                  trueIcon={<Badge status="success" text="Activo" />}
                  falseIcon={<Badge status="default" text="Inactivo" />}
                />
              </Space>

              {record.linkUrl && (
                <Space direction="vertical" size="small">
                  <Text strong>Enlace:</Text>
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    href={record.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: 0 }}
                  >
                    <TextField value={record.linkUrl} />
                  </Button>
                </Space>
              )}

              {record.imageUrl && (
                <Space direction="vertical" size="small">
                  <Text strong>URL de Imagen:</Text>
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    href={record.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ padding: 0 }}
                  >
                    <TextField value={record.imageUrl} />
                  </Button>
                </Space>
              )}
            </Space>
          </Card>

          {/* Información de Auditoría */}
          <Card title="Información de Auditoría">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong>Creado por:</Text>
                <Space style={{ marginLeft: 16 }}>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Space direction="vertical" size={0}>
                    <Text>
                      {record.createdBy.firstName} {record.createdBy.lastName}
                    </Text>
                    <EmailField value={record.createdBy.email} />
                  </Space>
                </Space>
              </div>

              <Divider />

              <Space size="large">
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
                <Text strong>ID de la Tarjeta:</Text>
                <Text code copyable style={{ marginLeft: 8 }}>
                  {record.id}
                </Text>
              </div>
              
              <div>
                <Text strong>ID del Creador:</Text>
                <Text code copyable style={{ marginLeft: 8 }}>
                  {record.createdBy.id}
                </Text>
              </div>
            </Space>
          </Card>
        </Space>
      )}
    </Show>
  );
};
