import { Show, TextField } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Descriptions, Divider, Tag } from "antd";
import { useParams } from "react-router";

export const UsersShow = () => {
  const { id } = useParams<{ id: string }>();
  
  // Obtener datos del usuario usando el hook de Refine
  const { data: userData, isLoading } = useOne({
    resource: "users",
    id: id!,
  });

  const record = userData?.data;

  return (
    <Show isLoading={isLoading} title="Detalle de usuario">
      <Descriptions column={2} bordered size="middle">
        <Descriptions.Item label="ID">
          <TextField value={record?.id} />
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          <TextField value={record?.email} />
        </Descriptions.Item>
        <Descriptions.Item label="Nombre">
          <TextField value={record?.firstName} />
        </Descriptions.Item>
        <Descriptions.Item label="Apellido">
          <TextField value={record?.lastName} />
        </Descriptions.Item>
        <Descriptions.Item label="Usuario">
          <TextField value={record?.username} />
        </Descriptions.Item>
        <Descriptions.Item label="Rol">
          {record && <Tag color="blue">{record.role}</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          {record?.isActive ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Último acceso">
          <TextField value={record?.lastLogin || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label="Creado">
          <TextField value={record?.createdAt} />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Información Personal" column={2} bordered size="middle">
        <Descriptions.Item label="Departamento">
          <TextField value={record?.personalInfo?.department || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label="Cargo">
          <TextField value={record?.personalInfo?.position || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label="Inicio">
          <TextField value={record?.personalInfo?.startDate || '-'} />
        </Descriptions.Item>
        <Descriptions.Item label="Máquina">
          <TextField value={record?.personalInfo?.currentMachine || '-'} />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Tarjetas" column={1} bordered size="middle">
        <Descriptions.Item label="Listado">
          {record?.cards?.length ? record.cards.map((c: any) => (
            <div key={c.id} style={{ marginBottom: 8 }}>
              <Tag>{c.type}</Tag> {c.title}
            </div>
          )) : 'Sin tarjetas'}
        </Descriptions.Item>
      </Descriptions>
    </Show>
  );
};


