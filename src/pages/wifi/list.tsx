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
import { Table, Space, Tag, Typography, Button, Image, QRCode, Modal } from "antd";
import { WifiOutlined, QrcodeOutlined } from "@ant-design/icons";
import type { WifiNetwork } from "../../types/wifi";

const { Text } = Typography;

export const WifiList: React.FC = () => {
  const translate = useTranslate();
  const { tableProps } = useTable<WifiNetwork, HttpError>({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: "networkName",
          order: "asc",
        },
      ],
    },
  });

  const [qrModalVisible, setQrModalVisible] = React.useState(false);
  const [selectedQR, setSelectedQR] = React.useState<{
    qrCode: string;
    networkName: string;
  } | null>(null);

  const showQRModal = (qrCode: string, networkName: string) => {
    setSelectedQR({ qrCode, networkName });
    setQrModalVisible(true);
  };

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="networkName"
            title="Nombre de Red"
            defaultFilteredValue={[]}
            render={(value: string, record: WifiNetwork) => (
              <Space direction="vertical" size={0}>
                <Space>
                  <WifiOutlined style={{ color: record.isActive ? '#52c41a' : '#d9d9d9' }} />
                  <Text strong>{value}</Text>
                </Space>
                {record.description && (
                  <Text type="secondary" ellipsis style={{ maxWidth: 250 }}>
                    {record.description}
                  </Text>
                )}
              </Space>
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
                    Activa
                  </Tag>
                }
                falseIcon={
                  <Tag color="default">
                    Inactiva
                  </Tag>
                }
              />
            )}
          />

          <Table.Column
            dataIndex="password"
            title="Contraseña"
            align="center"
            render={(value: string | null) => (
              value ? (
                <Tag color="orange">
                  🔒 Protegida
                </Tag>
              ) : (
                <Tag color="green">
                  🔓 Abierta
                </Tag>
              )
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

      <Modal
        title={`Código QR - ${selectedQR?.networkName || ''}`}
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            Cerrar
          </Button>
        ]}
        centered
      >
        {selectedQR && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Image
              src={selectedQR.qrCode}
              alt={`QR ${selectedQR.networkName}`}
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
            <p style={{ marginTop: '16px', color: '#666' }}>
              Escanea este código QR para conectarte a la red <strong>{selectedQR.networkName}</strong>
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};
