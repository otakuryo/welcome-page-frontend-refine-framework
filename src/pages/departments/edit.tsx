import { Edit, useForm } from "@refinedev/antd";
import { usePermissions } from "@refinedev/core";
import { Form, Input, Switch, Col, Row } from "antd";
import { useMemo } from "react";
import { useParams } from "react-router";
import type { UpdateDepartmentRequest } from "../../types/departments";

export const DepartmentsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: permissions } = usePermissions();
  const canManage = useMemo(() => 
    permissions === "ADMIN" || permissions === "CEO" || permissions === "RRHH" || permissions === "JEFE_DEPARTAMENTO", 
    [permissions]
  );

  const { formProps, saveButtonProps } = useForm<UpdateDepartmentRequest>({
    redirect: "list",
    resource: "departments",
    action: "edit",
    id,
  });

  if (!canManage) {
    return <div>No tienes permisos para editar departamentos.</div>;
  }

  return (
    <Edit saveButtonProps={saveButtonProps} title="Editar Departamento">
      <Form {...formProps} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Nombre del Departamento" 
              name="name" 
              rules={[
                { required: true, message: "El nombre es requerido" },
                { min: 2, message: "El nombre debe tener al menos 2 caracteres" },
                { max: 100, message: "El nombre no puede exceder 100 caracteres" }
              ]}
            >
              <Input placeholder="Ej: Recursos Humanos" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="Slug" 
              name="slug"
              rules={[
                { pattern: /^[a-z0-9-]+$/, message: "Solo se permiten letras minúsculas, números y guiones" },
                { max: 50, message: "El slug no puede exceder 50 caracteres" }
              ]}
              extra="Solo letras minúsculas, números y guiones. Cambiar esto puede afectar las URLs existentes."
            >
              <Input placeholder="Ej: recursos-humanos" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          label="Descripción" 
          name="description"
          rules={[
            { max: 500, message: "La descripción no puede exceder 500 caracteres" }
          ]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder="Describe las funciones y responsabilidades de este departamento..." 
          />
        </Form.Item>

        <Form.Item 
          label="Estado" 
          name="isActive" 
          valuePropName="checked"
          extra="Al desactivar un departamento, los usuarios asignados permanecerán pero no podrán acceder a las funciones del departamento"
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
