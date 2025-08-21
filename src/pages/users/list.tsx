import {
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Tag, Button } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import type { UsersListItem } from "../../types/users";
import { roleOptions } from "./models/RoleOptions";

export const UsersList = () => {
  const navigate = useNavigate();
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

  const handleRolColor = (value: string) => {
    const listRoles = {
      ADMIN: 'red',
      CEO: 'purple',
      RRHH: 'blue',
      'JEFE_DEPARTAMENTO': 'orange',
      USUARIO: 'green',
    }
    return listRoles[value as keyof typeof listRoles] || 'green';
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
            <Tag color={handleRolColor(value)}>
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
          render={(value: string | null) => value || 'Sin departamento'}
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
              <Button
                type="primary"
                size="small"
                icon={<KeyOutlined />}
                onClick={() => navigate(`/users/reset-password/${record.id}`)}
                title="Reiniciar Contraseña"
                style={{ backgroundColor: '#ff7875', borderColor: '#ff7875' }}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
