import React from "react";
import { Show, TextField, BooleanField, NumberField, DateField } from "@refinedev/antd";
import { Typography, Card, Space, Image, Tag, Button, Divider, theme } from "antd";
import { useShow } from "@refinedev/core";
import type { QuickLink } from "../../types/quicklinks";
import { 
  LinkOutlined, 
  GlobalOutlined, 
  CalendarOutlined, 
  SortAscendingOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FolderOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph, Link } = Typography;

export const QuickLinksShow = () => {
  const { query } = useShow<QuickLink>({
    resource: "quick-links",
  });

  const { data, isLoading } = query;
  const record = data?.data;
  
  const { token } = theme.useToken();

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header con icono y título */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {record?.iconUrl ? (
                <Image
                  src={record.iconUrl}
                  alt={record.title}
                  width={64}
                  height={64}
                  style={{ objectFit: "contain" }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8G+2yst4wCtnfAYhNzuRs5EjOWAjR27kgI0duZEjNnLARo7YyIEcuZEDNnLkQA7YyNk="
                />
              ) : (
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  backgroundColor: token.colorFillAlter, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  borderRadius: 8,
                  border: `2px dashed ${token.colorBorder}`
                }}>
                  <LinkOutlined style={{ fontSize: 24, color: token.colorTextTertiary }} />
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <Title level={2} style={{ margin: 0 }}>
                <TextField value={record?.title} />
              </Title>
              <Space style={{ marginTop: 8 }}>
                <BooleanField
                  value={record?.isActive}
                  trueIcon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                  falseIcon={<StopOutlined style={{ color: "#ff4d4f" }} />}
                  valueLabelTrue="Activo"
                  valueLabelFalse="Inactivo"
                />
                {record?.category && (
                  <Tag icon={<FolderOutlined />} color="blue">
                    {record.category}
                  </Tag>
                )}
              </Space>
            </div>
          </div>

          <Divider />

          {/* URL del enlace */}
          <Card size="small" title={<Space><GlobalOutlined />URL del Enlace</Space>}>
            <Link href={record?.url} target="_blank" rel="noopener noreferrer">
              <Button type="link" icon={<LinkOutlined />} style={{ padding: 0 }}>
                <TextField value={record?.url} />
              </Button>
            </Link>
          </Card>

          {/* Descripción */}
          {record?.description && (
            <Card size="small" title={<Space><FileTextOutlined />Descripción</Space>}>
              <Paragraph>
                <TextField value={record.description} />
              </Paragraph>
            </Card>
          )}

          {/* Información adicional */}
          <Card size="small" title="Información Adicional">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <SortAscendingOutlined />
                  <Text strong>Orden de visualización:</Text>
                </Space>
                <NumberField value={record?.sortOrder ?? "No definido"} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <CalendarOutlined />
                  <Text strong>Fecha de creación:</Text>
                </Space>
                <DateField 
                  value={record?.createdAt} 
                  format="DD/MM/YYYY HH:mm"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Space>
                  <CalendarOutlined />
                  <Text strong>Última actualización:</Text>
                </Space>
                <DateField 
                  value={record?.updatedAt} 
                  format="DD/MM/YYYY HH:mm"
                />
              </div>
            </Space>
          </Card>

          {/* Vista previa del enlace */}
          <Card size="small" title="Vista Previa">
            <div style={{ 
              padding: 16, 
              border: `1px solid ${token.colorBorder}`, 
              borderRadius: 8,
              backgroundColor: token.colorFillAlter,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{ width: 40, height: 40 }}>
                {record?.iconUrl ? (
                  <Image
                    src={record.iconUrl}
                    alt={record.title}
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                    preview={false}
                  />
                ) : (
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    backgroundColor: token.colorPrimaryBg, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    borderRadius: 4 
                  }}>
                    <LinkOutlined style={{ color: token.colorPrimary }} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>
                  {record?.title}
                </div>
                {record?.description && (
                  <div style={{ 
                    fontSize: 12, 
                    color: token.colorTextSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {record.description}
                  </div>
                )}
              </div>
              <Button 
                type="primary" 
                icon={<LinkOutlined />}
                onClick={() => window.open(record?.url, '_blank')}
              >
                Abrir
              </Button>
            </div>
          </Card>
        </Space>
      </Card>
    </Show>
  );
};
