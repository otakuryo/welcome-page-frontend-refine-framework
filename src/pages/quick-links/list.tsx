import React from "react";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  FilterDropdown,
  useSelect,
  TagField,
  BooleanField,
} from "@refinedev/antd";
import { 
  Table, 
  Space, 
  Select, 
  Typography,
  Button,
  Image,
  Tooltip,
} from "antd";
import type { BaseRecord } from "@refinedev/core";
import type { QuickLink } from "../../types/quicklinks";
import { 
  LinkOutlined, 
  SortAscendingOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { Text, Link } = Typography;

export const QuickLinksList = () => {
  const { tableProps } = useTable<QuickLink>({
    syncWithLocation: true,
    resource: "quick-links",
    sorters: {
      initial: [
        {
          field: "sortOrder",
          order: "asc",
        },
      ],
    },
  });

  return (
    <List>
      <Table 
        {...tableProps} 
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} enlaces`,
        }}
      >
        <Table.Column
          dataIndex="iconUrl"
          title="Icono"
          width={80}
          render={(iconUrl: string) => (
            iconUrl ? (
              <Image
                src={iconUrl}
                alt="Icono"
                width={32}
                height={32}
                style={{ objectFit: "contain" }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RUG8G+2yst4wCtnfAYhNzuRs5EjOWAjR27kgI0duZEjNnLARo7YyIEcuZEDNnLkQA7YyNk="
              />
            ) : (
              <div style={{ width: 32, height: 32, backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                <LinkOutlined style={{ color: "#999" }} />
              </div>
            )
          )}
        />
        
        <Table.Column
          dataIndex="title"
          title="Título"
          render={(value: string, record: QuickLink) => (
            <Space direction="vertical" size={0}>
              <Text strong>{value}</Text>
              {record.category && (
                <TagField value={record.category} color="blue" />
              )}
            </Space>
          )}
        />

        <Table.Column
          dataIndex="url"
          title="URL"
          width={250}
          render={(value: string) => (
            <Tooltip title={value}>
              <Link href={value} target="_blank" rel="noopener noreferrer">
                <Text ellipsis style={{ maxWidth: 200 }}>
                  {value}
                </Text>
              </Link>
            </Tooltip>
          )}
        />

        <Table.Column
          dataIndex="description"
          title="Descripción"
          width={250}
          render={(value: string | null) => (
            value ? (
              <Tooltip title={value}>
                <Text ellipsis style={{ maxWidth: 200 }}>
                  {value}
                </Text>
              </Tooltip>
            ) : (
              <Text type="secondary">Sin descripción</Text>
            )
          )}
        />

        <Table.Column
          dataIndex="sortOrder"
          title={
            <Space>
              <SortAscendingOutlined />
              Orden
            </Space>
          }
          width={100}
          render={(value: number | null) => (
            value !== null ? (
              <Text>{value}</Text>
            ) : (
              <Text type="secondary">-</Text>
            )
          )}
          sorter
        />

        <Table.Column
          dataIndex="isActive"
          title="Estado"
          width={100}
          render={(value: boolean) => (
            <BooleanField
              value={value}
              trueIcon={<CheckCircleOutlined />}
              falseIcon={<StopOutlined />}
              valueLabelTrue="Activo"
              valueLabelFalse="Inactivo"
            />
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Filtrar por estado"
                options={[
                  { label: "Activo", value: true },
                  { label: "Inactivo", value: false },
                ]}
              />
            </FilterDropdown>
          )}
        />

        <Table.Column
          dataIndex="createdAt"
          title="Fecha de Creación"
          width={150}
          render={(value: string) => (
            <Text>
              {new Date(value).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          )}
          sorter
        />

        <Table.Column
          title="Acciones"
          dataIndex="actions"
          width={180}
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton 
                hideText 
                size="small" 
                recordItemId={record.id}
                confirmTitle="¿Estás seguro de que quieres eliminar este enlace?"
                confirmOkText="Sí, eliminar"
                confirmCancelText="Cancelar"
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
