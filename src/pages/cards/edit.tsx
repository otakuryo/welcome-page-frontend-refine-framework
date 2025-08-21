import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, Switch, Space, Alert } from "antd";
import type { UpdateCardRequest, CardType, FullCard } from "../../types/cards";

const { TextArea } = Input;
const { Option } = Select;

const cardTypeOptions: { value: CardType; label: string }[] = [
  { value: "ERP", label: "ERP" },
  { value: "CONTROL_TIEMPOS", label: "Control de Tiempos" },
  { value: "PROGRAMAS", label: "Programas" },
  { value: "GESTOR_PASSWORDS", label: "Gestor de Contraseñas" },
  { value: "INFORMACION_PERSONAL", label: "Información Personal" },
  { value: "CALENDARIOS", label: "Calendarios" },
  { value: "MAQUINA_ACTUAL", label: "Máquina Actual" },
  { value: "WIFI", label: "WiFi" },
  { value: "ENLACES", label: "Enlaces" },
];

export const CardsEdit: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm<FullCard, {}, UpdateCardRequest>();
  
  const cardData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {cardData && (
          <Alert
            message="Información de la Tarjeta"
            description={
              <Space direction="vertical" size={4}>
                <span><strong>ID:</strong> {cardData.id}</span>
                <span><strong>Creado:</strong> {new Date(cardData.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
                <span><strong>Última actualización:</strong> {new Date(cardData.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
                <span><strong>Creado por:</strong> {cardData.createdBy.firstName} {cardData.createdBy.lastName} ({cardData.createdBy.email})</span>
              </Space>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item
          label="Título"
          name="title"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el título de la tarjeta",
            },
            {
              min: 3,
              message: "El título debe tener al menos 3 caracteres",
            },
            {
              max: 100,
              message: "El título no puede exceder los 100 caracteres",
            },
          ]}
        >
          <Input placeholder="Ingresa el título de la tarjeta" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[
            {
              max: 500,
              message: "La descripción no puede exceder los 500 caracteres",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Ingresa una descripción para la tarjeta"
          />
        </Form.Item>

        <Form.Item
          label="Tipo"
          name="type"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el tipo de tarjeta",
            },
          ]}
        >
          <Select placeholder="Selecciona el tipo de tarjeta">
            {cardTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="URL del Enlace"
          name="linkUrl"
          rules={[
            {
              type: "url",
              message: "Por favor ingresa una URL válida",
            },
          ]}
        >
          <Input
            placeholder="https://ejemplo.com"
          />
        </Form.Item>

        <Form.Item
          label="URL de la Imagen"
          name="imageUrl"
          rules={[
            {
              type: "url",
              message: "Por favor ingresa una URL válida para la imagen",
            },
          ]}
        >
          <Input
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </Form.Item>

        <Form.Item
          label="Orden de Clasificación"
          name="sortOrder"
          rules={[
            {
              type: "number",
              min: 0,
              message: "El orden debe ser un número positivo",
            },
          ]}
          tooltip="Número que determina el orden de aparición de la tarjeta. Menor número = mayor prioridad."
        >
          <InputNumber
            min={0}
            max={9999}
            placeholder="0"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Estado"
          name="isActive"
          valuePropName="checked"
          tooltip="Desactivar una tarjeta la oculta para los usuarios finales pero mantiene sus asignaciones"
        >
          <Switch
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Form.Item>

        <Form.Item>
          <Alert
            message="Nota importante"
            description="Los cambios en el tipo de tarjeta pueden afectar cómo se muestra a los usuarios. Las asignaciones existentes se mantendrán."
            type="warning"
            showIcon
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
