import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber } from "antd";
import type { QuickLink, UpdateQuickLinkRequest } from "../../types/quicklinks";
import { LinkOutlined } from "@ant-design/icons";

export const QuickLinksEdit = () => {
  const { formProps, saveButtonProps, query } = useForm<QuickLink, {}, UpdateQuickLinkRequest>({
    resource: "quick-links",
    redirect: "list",
  });

  const validateUrl = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("La URL es requerida");
    }
    
    try {
      new URL(value);
      return Promise.resolve();
    } catch {
      return Promise.reject("Por favor ingresa una URL válida");
    }
  };

  return (
    <Edit 
      saveButtonProps={saveButtonProps}
      isLoading={query?.isLoading}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Título"
          name="title"
          rules={[
            {
              required: true,
              message: "El título es requerido",
            },
            {
              max: 100,
              message: "El título no puede exceder 100 caracteres",
            },
          ]}
        >
          <Input 
            placeholder="Ej: Portal de Recursos Humanos"
            prefix={<LinkOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="URL"
          name="url"
          rules={[
            {
              required: true,
              validator: validateUrl,
            },
          ]}
        >
          <Input 
            placeholder="https://ejemplo.com" 
            type="url"
          />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[
            {
              max: 500,
              message: "La descripción no puede exceder 500 caracteres",
            },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Descripción del enlace rápido"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="category"
          rules={[
            {
              max: 50,
              message: "La categoría no puede exceder 50 caracteres",
            },
          ]}
        >
          <Input placeholder="Ej: Recursos Humanos, Sistemas, Comunicación" />
        </Form.Item>

        <Form.Item
          label="URL del Icono"
          name="iconUrl"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                try {
                  new URL(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject("Por favor ingresa una URL válida para el icono");
                }
              },
            },
          ]}
        >
          <Input 
            placeholder="https://ejemplo.com/icono.png" 
            type="url"
          />
        </Form.Item>

        <Form.Item
          label="Orden de Visualización"
          name="sortOrder"
          tooltip="Números menores aparecerán primero en la lista"
          rules={[
            {
              type: "number",
              min: 0,
              message: "El orden debe ser un número positivo",
            },
          ]}
        >
          <InputNumber
            min={0}
            max={9999}
            style={{ width: "100%" }}
            placeholder="1"
          />
        </Form.Item>

        <Form.Item
          label="Estado"
          name="isActive"
          valuePropName="checked"
          tooltip="Los enlaces inactivos no se mostrarán a los usuarios finales"
        >
          <Switch
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
