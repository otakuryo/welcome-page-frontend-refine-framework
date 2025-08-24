import { Card, Typography, Space, Avatar, Button } from "antd";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useGetIdentity, usePermissions } from "@refinedev/core";
import { useNavigate } from "react-router";

const { Title, Paragraph } = Typography;

interface UserIdentity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export const Welcome = () => {
  const { data: user } = useGetIdentity<UserIdentity>();
  const { data: permissions } = usePermissions();
  const navigate = useNavigate();
  
  // Verificar si el usuario tiene permisos de administración
  const hasAdminPermissions = permissions === "ADMIN" || permissions === "CEO" || permissions === "RRHH";
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <Card 
        style={{ 
          maxWidth: 600, 
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        }}
        bodyStyle={{ padding: "40px" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%", textAlign: "center" }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: "#1890ff",
              margin: "0 auto",
              display: "block"
            }} 
          />
          
          <div>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              ¡Bienvenido al Sistema ADN!
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#666", margin: "16px 0" }}>
              {user?.name ? `Hola, ${user.name}!` : "Hola!"}
            </Paragraph>
          </div>
          
          <Paragraph style={{ fontSize: "14px", color: "#888", lineHeight: "1.6" }}>
            Has iniciado sesión correctamente en el sistema. 
            Como usuario con permisos limitados, tienes acceso a la información básica del sistema.
          </Paragraph>
          
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#f5f5f5", 
            borderRadius: "8px",
            border: "1px solid #e8e8e8"
          }}>
            <Paragraph style={{ margin: 0, color: "#666" }}>
              <strong>Tu rol:</strong> {user?.role || "Usuario"}
            </Paragraph>
            <Paragraph style={{ margin: "8px 0 0 0", color: "#666" }}>
              <strong>Email:</strong> {user?.email || "No disponible"}
            </Paragraph>
          </div>
          
          {/* Botón de administración solo para usuarios con permisos */}
          {hasAdminPermissions && (
            <Button
              type="primary"
              size="large"
              icon={<SettingOutlined />}
              onClick={() => navigate("/users")}
              style={{
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)"
              }}
            >
              Acceder al Panel de Administración
            </Button>
          )}
          
          <Paragraph style={{ fontSize: "12px", color: "#999", margin: "20px 0 0 0" }}>
            {hasAdminPermissions 
              ? "Tienes acceso completo al sistema de administración."
              : "Si necesitas acceso a funcionalidades adicionales, contacta a tu administrador."
            }
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};