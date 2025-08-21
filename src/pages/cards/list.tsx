import React from "react";
import {
  BaseRecord,
  useTranslate,
  HttpError,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  BooleanField,
  TagField,
} from "@refinedev/antd";
import { Table, Space, Tag, Typography, Avatar } from "antd";
import type { CardListItem, CardType } from "../../types/cards";

const { Text } = Typography;

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

export const CardsList: React.FC = () => {
  const translate = useTranslate();
  const { tableProps } = useTable<CardListItem, HttpError>({
    syncWithLocation: true,
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
      <Table {...tableProps} rowKey="id">

        <Table.Column
          dataIndex="sortOrder"
          title="Orden"
          sorter
          align="center"
          width={80}
          render={(value: number) => (
            <Tag color="blue">{value}</Tag>
          )}
        />

        <Table.Column
          dataIndex="title"
          title="Título"
          defaultFilteredValue={[]}
          render={(value: string, record: CardListItem) => (
            <Space direction="vertical" size={0}>
              <Text strong>{value}</Text>
              {record.description && (
                <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                  {record.description}
                </Text>
              )}
            </Space>
          )}
        />

        <Table.Column
          dataIndex="type"
          title="Tipo"
          render={(value: CardType) => (
            <TagField
              value={cardTypeLabels[value]}
              color={cardTypeColors[value]}
            />
          )}
        />

        <Table.Column
          dataIndex="isActive"
          title="Estado"
          align="center"
          render={(value: boolean) => (
            <BooleanField
              value={value}
              trueIcon={
                <Tag color="success">
                  Activo
                </Tag>
              }
              falseIcon={
                <Tag color="default">
                  Inactivo
                </Tag>
              }
            />
          )}
        />

        <Table.Column
          dataIndex="imageUrl"
          title="Imagen"
          align="center"
          width={80}
          render={(value: string | null) => 
            value ? (
              <Avatar
                src={value}
                alt="Card image"
                size="small"
                shape="square"
              />
            ) : (
              <Avatar
                size="small"
                shape="square"
                style={{ backgroundColor: '#f0f0f0', color: '#999' }}
              >
                N/A
              </Avatar>
            )
          }
        />

        <Table.Column
          dataIndex={["createdBy", "email"]}
          title="Creado por"
          render={(value: string, record: CardListItem) => (
            <Space direction="vertical" size={0}>
              <Text strong>
                {record.createdBy.firstName} {record.createdBy.lastName}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {value}
              </Text>
            </Space>
          )}
        />

        <Table.Column
          dataIndex="createdAt"
          title="Fecha de Creación"
          sorter
          render={(value: string) => (
            <Text type="secondary">
              {new Date(value).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        />

        <Table.Column
          title="Acciones"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
