import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Typography } from "antd";
import type { DepartmentListItem } from "../../types/departments";

const { Text } = Typography;

export const DepartmentsList = () => {
  const { tableProps } = useTable<DepartmentListItem>({
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "name",
          order: "asc",
        },
      ],
    },
  });

  const paginationOptions = {
    ...tableProps.pagination,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => 
      `${range[0]}-${range[1]} de ${total} elementos`,
  };

  return (
    <List
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <CreateButton>Crear Departamento</CreateButton>
        </>
      )}
    >
      <Table 
        {...tableProps} 
        rowKey="id"
        pagination={paginationOptions}
        sticky={{ offsetHeader: 64 }}
      >
        <Table.Column 
          dataIndex="name" 
          title="Nombre"
          sorter
          render={(value: string) => (
            <Text strong>{value}</Text>
          )}
        />
        
        <Table.Column 
          dataIndex="slug" 
          title="Slug"
          render={(value: string) => (
            <Tag color="blue">{value}</Tag>
          )}
        />
        
        <Table.Column 
          dataIndex="description" 
          title="Descripción"
          render={(value: string) => (
            <Text ellipsis style={{ maxWidth: 300 }}>
              {value || "Sin descripción"}
            </Text>
          )}
        />
        
        <Table.Column 
          dataIndex="isActive" 
          title="Estado"
          render={(value: boolean) => (
            <Tag color={value ? "green" : "red"}>
              {value ? "Activo" : "Inactivo"}
            </Tag>
          )}
        />
        
        <Table.Column 
          dataIndex={["_count", "users"]} 
          title="Usuarios"
          render={(value: number) => (
            <Tag color="cyan">{value} usuarios</Tag>
          )}
        />
        
        <Table.Column 
          dataIndex={["_count", "cards"]} 
          title="Tarjetas"
          render={(value: number) => (
            <Tag color="orange">{value} tarjetas</Tag>
          )}
        />
        
        <Table.Column
          title="Acciones"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
