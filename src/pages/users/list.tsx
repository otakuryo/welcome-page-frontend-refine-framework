import {
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import type { UsersListItem } from "../../types/users";
import { roleOptions } from "./models/RoleOptions";

export const UsersList = () => {
  const { tableProps } = useTable({
    pagination: {
      pageSize: 10,
    },
  });

  const paginationOptions = {
    ...tableProps.pagination,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => 
      `${range[0]}-${range[1]} de ${total} elementos`,
  }

  return (
    <List>
      <Table 
        {...tableProps} 
        rowKey="id"
        pagination={paginationOptions}
        sticky={{ offsetHeader: 64 }}
      >
        <Table.Column 
          dataIndex="username" 
          title={"Usuario"} 
          render={(value: string, record: UsersListItem) => (
            <div>
              <div>{value}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.firstName} {record.lastName}
              </div>
            </div>
          )}
        />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column 
          dataIndex="role" 
          title={"Rol"} 
          render={(value: string) => (
            <Tag color={
              value === 'ADMIN' ? 'red' :
              value === 'CEO' ? 'purple' :
              value === 'RRHH' ? 'blue' :
              value === 'JEFE_DEPARTAMENTO' ? 'orange' :
              'green'
            }>
              {roleOptions.find(option => option.value === value)?.label || value}
            </Tag>
          )}
        />
        <Table.Column 
          dataIndex="isActive" 
          title={"Estado"} 
          render={(value: boolean) => (
            <Tag color={value ? 'green' : 'red'}>
              {value ? 'Activo' : 'Inactivo'}
            </Tag>
          )}
        />
        <Table.Column 
          dataIndex={["personalInfo", "department"]} 
          title={"Departamento"} 
          render={(value: string | null) => value || '-'}
        />
        {/* <Table.Column 
          dataIndex="cardCount" 
          title={"Tarjetas"} 
          render={(value: number) => (
            <Tag color="blue">{value}</Tag>
          )}
        /> */}
        <Table.Column
          title={"Acciones"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
