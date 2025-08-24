import {
    Card,
    Typography,
    Space,
    Avatar,
    Button,
    Row,
    Col,
    Image,
    Tag,
} from "antd";
import {
    UserOutlined,
    SettingOutlined,
    WifiOutlined,
    LinkOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import {
    useCustom,
    useGetIdentity,
    useList,
    usePermissions,
} from "@refinedev/core";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import type { MyCardItem } from "../types/cards";
import type { WifiNetwork } from "../types/wifi";
import type { QuickLink } from "../types/quicklinks";
import { DATA_PROVIDER_CONFIG } from "../dataProvider/config";
import { UserDetailed } from "../types";

const { Title, Paragraph, Text } = Typography;

export const Welcome = () => {
    const navigate = useNavigate();
    let hasAdminPermissions = false

    // Estados para los datos
    const [loading, setLoading] = useState(false);

    // Obtener información del usuario
    const userQuery = useGetIdentity<UserDetailed>();
    const user = useMemo(() => {
        if (userQuery.data) {
            hasAdminPermissions = userQuery.data.role === "ADMIN" || userQuery.data.role === "CEO" || userQuery.data.role === "RRHH" || userQuery.data.role === "JEFE_DEPARTAMENTO";
            return userQuery.data;
        }
        return null;
    }, [userQuery]);

    // Obtener tarjetas del usuario
    const cardsResponseQuery = useCustom<MyCardItem[]>({
        url: "/cards/my-cards",
        method: "get",
        queryOptions: {
            enabled: true,
        },
    });

    const userCards = useMemo(() => {
        return cardsResponseQuery.data?.data || [];
    }, [cardsResponseQuery.data]);

    // Obtener redes WiFi
    const wifiResponseQuery = useList<WifiNetwork>({
        resource: DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.WIFI,
        queryOptions: {
            enabled: true,
        },
    });

    const wifiNetworks = useMemo(() => {
        return wifiResponseQuery.data?.data || [];
    }, [wifiResponseQuery.data]);

    // Obtener enlaces rápidos
    const quickLinksResponseQuery = useList<QuickLink>({
        resource: DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.QUICK_LINKS,
        queryOptions: {
            enabled: true,
        },
    });

    const quickLinks = useMemo(() => {
        return quickLinksResponseQuery.data?.data || [];
    }, [quickLinksResponseQuery.data]);


    // Función para obtener imagen placeholder si no hay imagen
    const getImageUrl = (imageUrl: string | null) => {
        return imageUrl || "/img/placeholder.png";
    };

    // Función para obtener el color del tag según el tipo de tarjeta
    const getCardTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            ERP: "blue",
            CONTROL_TIEMPOS: "green",
            PROGRAMAS: "purple",
            GESTOR_PASSWORDS: "orange",
            INFORMACION_PERSONAL: "cyan",
            CALENDARIOS: "magenta",
            MAQUINA_ACTUAL: "geekblue",
            WIFI: "lime",
            ENLACES: "gold",
        };
        return colors[type] || "default";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "20px",
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {/* Header con logo de empresa y usuario */}
                <Card
                    style={{
                        marginBottom: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "24px" }}
                >
                    <Row align="middle" justify="space-between">
                        <Col>
                            <Space size="large">
                                <Image
                                    src="/img/logo-adn.png"
                                    alt="Logo ADN"
                                    width={100}
                                    height={100}
                                    fallback="/img/placeholder.png"
                                    style={{ borderRadius: "8px", objectFit: "contain" }}
                                />
                                <div>
                                    <Title level={3} style={{ margin: 0, color: "#1890ff" }}>
                                        Sistema ADN
                                    </Title>
                                    <Text type="secondary">Bienvenido al portal de recursos</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Space direction="vertical" align="end">
                                <Avatar
                                    size={50}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: "#1890ff" }}
                                />
                                <div style={{ textAlign: "right" }}>
                                    <Text strong>
                                        {user ? `${user.firstName} ${user.lastName}` : "Usuario"}
                                    </Text>
                                    <br />
                                    <Text type="secondary">{user?.role || "Usuario"}</Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Información del usuario */}
                <Card
                    style={{
                        marginBottom: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "24px" }}
                >
                    <Title level={4} style={{ marginBottom: "16px", color: "#1890ff" }}>
                        <UserOutlined /> Información Personal
                    </Title>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Text strong>Nombre:</Text>
                            <br />
                            <Text>
                                {user ? `${user.firstName} ${user.lastName}` : "No disponible"}
                            </Text>
                        </Col>
                        <Col span={8}>
                            <Text strong>Email:</Text>
                            <br />
                            <Text>{user?.email || "No disponible"}</Text>
                        </Col>
                        <Col span={8}>
                            <Text strong>Rol:</Text>
                            <br />
                            <Tag color="blue">{user?.role || "Usuario"}</Tag>
                        </Col>
                    </Row>

                    {hasAdminPermissions && (
                        <div style={{ marginTop: "16px" }}>
                            <Button
                                type="primary"
                                icon={<SettingOutlined />}
                                onClick={() => navigate("/users")}
                                style={{ borderRadius: "8px" }}
                            >
                                Acceder al Panel de Administración
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Tarjetas del usuario */}
                <Card
                    style={{
                        marginBottom: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "24px" }}
                >
                    <Title level={4} style={{ marginBottom: "16px", color: "#1890ff" }}>
                        <CreditCardOutlined /> Mis Tarjetas Asignadas
                    </Title>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <Text>Cargando tarjetas...</Text>
                        </div>
                    ) : userCards.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {userCards.map((card) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={card.id}>
                                    <Card
                                        hoverable
                                        style={{ height: "100%" }}
                                        bodyStyle={{ padding: "16px", textAlign: "center" }}
                                        onClick={() =>
                                            card.linkUrl && window.open(card.linkUrl, "_blank")
                                        }
                                    >
                                        <Image
                                            src={getImageUrl(card.imageUrl)}
                                            alt={card.title}
                                            width={80}
                                            height={80}
                                            fallback="/img/placeholder.png"
                                            style={{ borderRadius: "8px", marginBottom: "12px" }}
                                            preview={false}
                                        />
                                        <Title
                                            level={5}
                                            style={{ margin: "8px 0", fontSize: "14px" }}
                                        >
                                            {card.title}
                                        </Title>
                                        {card.description && (
                                            <Paragraph
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    margin: "8px 0",
                                                }}
                                            >
                                                {card.description}
                                            </Paragraph>
                                        )}
                                        <Tag
                                            color={getCardTypeColor(card.type)}
                                            style={{ marginTop: "8px" }}
                                        >
                                            {card.type}
                                        </Tag>
                                        {card.isFeatured && (
                                            <Tag color="gold" style={{ marginTop: "8px" }}>
                                                Destacada
                                            </Tag>
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "40px", color: "#999" }}
                        >
                            <CreditCardOutlined
                                style={{ fontSize: "48px", marginBottom: "16px" }}
                            />
                            <br />
                            <Text>No tienes tarjetas asignadas</Text>
                        </div>
                    )}
                </Card>

                {/* Redes WiFi */}
                <Card
                    style={{
                        marginBottom: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "24px" }}
                >
                    <Title level={4} style={{ marginBottom: "16px", color: "#1890ff" }}>
                        <WifiOutlined /> Redes WiFi Disponibles
                    </Title>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <Text>Cargando redes WiFi...</Text>
                        </div>
                    ) : wifiNetworks.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {wifiNetworks.map((wifi) => (
                                <Col xs={24} sm={12} md={8} key={wifi.id}>
                                    <Card
                                        style={{ height: "100%" }}
                                        bodyStyle={{ padding: "16px", textAlign: "center" }}
                                    >
                                        <WifiOutlined
                                            style={{
                                                fontSize: "48px",
                                                color: "#52c41a",
                                                marginBottom: "16px",
                                            }}
                                        />
                                        <Title
                                            level={5}
                                            style={{ margin: "8px 0", fontSize: "16px" }}
                                        >
                                            {wifi.networkName}
                                        </Title>
                                        {wifi.description && (
                                            <Paragraph
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    margin: "8px 0",
                                                }}
                                            >
                                                {wifi.description}
                                            </Paragraph>
                                        )}
                                        {wifi.password && (
                                            <div style={{ marginTop: "12px" }}>
                                                <Text strong>Contraseña: </Text>
                                                <Text code>{wifi.password}</Text>
                                            </div>
                                        )}
                                        {wifi.qrCode && (
                                            <div style={{ marginTop: "12px" }}>
                                                <Image
                                                    src={wifi.qrCode}
                                                    alt={`QR ${wifi.networkName}`}
                                                    width={100}
                                                    height={100}
                                                    fallback="/img/placeholder.png"
                                                />
                                            </div>
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "40px", color: "#999" }}
                        >
                            <WifiOutlined
                                style={{ fontSize: "48px", marginBottom: "16px" }}
                            />
                            <br />
                            <Text>No hay redes WiFi disponibles</Text>
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <Card
                    style={{
                        marginBottom: "20px",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "24px" }}
                >
                    <Title level={4} style={{ marginBottom: "16px", color: "#1890ff" }}>
                        <LinkOutlined /> Enlaces Rápidos
                    </Title>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "40px" }}>
                            <Text>Cargando enlaces...</Text>
                        </div>
                    ) : quickLinks.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {quickLinks.map((link) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={link.id}>
                                    <Card
                                        hoverable
                                        style={{ height: "100%" }}
                                        bodyStyle={{ padding: "16px", textAlign: "center" }}
                                        onClick={() => window.open(link.url, "_blank")}
                                    >
                                        {link.iconUrl ? (
                                            <Image
                                                src={getImageUrl(link.iconUrl)}
                                                alt={link.title}
                                                width={60}
                                                height={60}
                                                fallback="/img/placeholder.png"
                                                style={{ borderRadius: "8px", marginBottom: "12px" }}
                                            />
                                        ) : (
                                            <LinkOutlined
                                                style={{
                                                    fontSize: "48px",
                                                    color: "#1890ff",
                                                    marginBottom: "16px",
                                                }}
                                            />
                                        )}
                                        <Title
                                            level={5}
                                            style={{ margin: "8px 0", fontSize: "14px" }}
                                        >
                                            {link.title}
                                        </Title>
                                        {link.description && (
                                            <Paragraph
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    margin: "8px 0",
                                                }}
                                            >
                                                {link.description}
                                            </Paragraph>
                                        )}
                                        {link.category && (
                                            <Tag color="purple" style={{ marginTop: "8px" }}>
                                                {link.category}
                                            </Tag>
                                        )}
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div
                            style={{ textAlign: "center", padding: "40px", color: "#999" }}
                        >
                            <LinkOutlined
                                style={{ fontSize: "48px", marginBottom: "16px" }}
                            />
                            <br />
                            <Text>No hay enlaces rápidos disponibles</Text>
                        </div>
                    )}
                </Card>

                {/* Footer */}
                <Card
                    style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                    bodyStyle={{ padding: "20px", textAlign: "center" }}
                >
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        {hasAdminPermissions
                            ? "Tienes acceso completo al sistema de administración."
                            : "Si necesitas acceso a funcionalidades adicionales, contacta a tu administrador."}
                    </Text>
                </Card>
            </div>
        </div>
    );
};
