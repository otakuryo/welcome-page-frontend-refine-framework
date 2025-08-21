import { Show, TextField } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Descriptions, Divider, Tag, Typography, Card, Row, Col, Avatar, Space } from "antd";
import { TeamOutlined, CreditCardOutlined, UserOutlined } from "@ant-design/icons";
import { useParams } from "react-router";
import type { DepartmentDetailed } from "../../types/departments";

const { Title, Text } = Typography;

export const DepartmentsShow = () => {
  const { id } = useParams<{ id: string }>();
  
  // Obtener datos del departamento usando el hook de Refine
  const { data: departmentData, isLoading } = useOne<DepartmentDetailed>({
    resource: "departments",
    id: id!,
  });

  const record = departmentData?.data;

  return (
    <Show isLoading={isLoading} title={`Departamento: ${record?.name || ""}`}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label="ID">
                <TextField value={record?.id} />
              </Descriptions.Item>
              <Descriptions.Item label="Nombre">
                <TextField value={record?.name} />
              </Descriptions.Item>
              <Descriptions.Item label="Slug">
                <Tag color="blue">{record?.slug}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                {record?.isActive ? (
                  <Tag color="green">Activo</Tag>
                ) : (
                  <Tag color="red">Inactivo</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Descripción" span={2}>
                <TextField value={record?.description || "Sin descripción"} />
              </Descriptions.Item>
              <Descriptions.Item label="Creado">
                <TextField value={record?.createdAt} />
              </Descriptions.Item>
              <Descriptions.Item label="Actualizado">
                <TextField value={record?.updatedAt} />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Sección de Usuarios */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Usuarios del Departamento ({record?.users?.length || 0})</span>
              </Space>
            }
          >
            {record?.users && record.users.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {record.users.map((userAssignment) => (
                  <Card key={userAssignment.id} size="small">
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Text strong>
                          {userAssignment.user.firstName} {userAssignment.user.lastName}
                        </Text>
                        <br />
                        <Text type="secondary">{userAssignment.user.email}</Text>
                        <br />
                        <Space>
                          <Tag color="blue">{userAssignment.user.role}</Tag>
                          {userAssignment.isHead && <Tag color="orange">Jefe</Tag>}
                          <Tag color={userAssignment.isActive ? "green" : "red"}>
                            {userAssignment.isActive ? "Activo" : "Inactivo"}
                          </Tag>
                        </Space>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Se unió: {new Date(userAssignment.joinedAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No hay usuarios asignados a este departamento</Text>
            )}
          </Card>
        </Col>

        {/* Sección de Tarjetas */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <CreditCardOutlined />
                <span>Tarjetas del Departamento ({record?.cards?.length || 0})</span>
              </Space>
            }
          >
            {record?.cards && record.cards.length > 0 ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                {record.cards.map((cardAssignment) => (
                  <Card key={cardAssignment.id} size="small">
                    <div>
                      <Text strong>{cardAssignment.card.title}</Text>
                      <br />
                      {cardAssignment.card.description && (
                        <>
                          <Text type="secondary">{cardAssignment.card.description}</Text>
                          <br />
                        </>
                      )}
                      <Space>
                        <Tag color="purple">{cardAssignment.card.type}</Tag>
                        <Tag color={cardAssignment.card.isActive ? "green" : "red"}>
                          {cardAssignment.card.isActive ? "Activa" : "Inactiva"}
                        </Tag>
                        {cardAssignment.canEdit && <Tag color="blue">Puede Editar</Tag>}
                        {cardAssignment.canDelete && <Tag color="red">Puede Eliminar</Tag>}
                      </Space>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Asignada: {new Date(cardAssignment.assignedAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </Card>
                ))}
              </Space>
            ) : (
              <Text type="secondary">No hay tarjetas asignadas a este departamento</Text>
            )}
          </Card>
        </Col>
      </Row>
    </Show>
  );
};
