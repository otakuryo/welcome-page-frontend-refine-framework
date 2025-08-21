// Ejemplos de uso del servicio y proveedor de redes WiFi
// Este archivo no se ejecuta, solo sirve como referencia

import { dataProvider } from '../dataProvider';
import type { 
  WifiNetwork,
  CreateWifiNetworkRequest,
  UpdateWifiNetworkRequest,
  WifiListQuery
} from '../types/wifi';

// Ejemplo 1: Obtener lista de todas las redes WiFi
export const getAllWifiNetworks = async () => {
  const response = await dataProvider.getList<WifiNetwork>({
    resource: "wifi",
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  
  console.log('Redes WiFi encontradas:', response.data);
  console.log('Total de redes:', response.total);
  
  response.data.forEach(network => {
    console.log(`- ${network.networkName} (${network.isActive ? 'Activa' : 'Inactiva'})`);
    if (network.description) {
      console.log(`  Descripción: ${network.description}`);
    }
  });
};

// Ejemplo 2: Obtener solo redes WiFi activas
export const getActiveWifiNetworks = async () => {
  const response = await dataProvider.getList<WifiNetwork>({
    resource: "wifi",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('Redes WiFi activas:', response.data);
  
  response.data.forEach(network => {
    console.log(`📶 ${network.networkName}`);
    if (network.qrCode) {
      console.log(`  QR disponible: ${network.qrCode.substring(0, 50)}...`);
    }
  });
};

// Ejemplo 3: Obtener una red WiFi específica
export const getWifiNetwork = async (id: string) => {
  const response = await dataProvider.getOne<WifiNetwork>({
    resource: "wifi",
    id
  });
  
  console.log('Red WiFi:', response.data);
  console.log('Nombre:', response.data.networkName);
  console.log('Estado:', response.data.isActive ? 'Activa' : 'Inactiva');
  console.log('Tiene contraseña:', response.data.password ? 'Sí' : 'No');
  console.log('Tiene QR:', response.data.qrCode ? 'Sí' : 'No');
  console.log('Creada:', new Date(response.data.createdAt).toLocaleDateString());
  console.log('Actualizada:', new Date(response.data.updatedAt).toLocaleDateString());
};

// Ejemplo 4: Crear una nueva red WiFi
export const createWifiNetwork = async () => {
  const newNetwork: CreateWifiNetworkRequest = {
    networkName: "ADN_Guest_WiFi",
    password: "ADN2024*Secure",
    description: "Red WiFi para invitados de la empresa",
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  };
  
  const response = await dataProvider.create<WifiNetwork>({
    resource: "wifi",
    variables: newNetwork
  });
  
  console.log('Red WiFi creada:', response.data);
  console.log('ID:', response.data.id);
  console.log('Nombre:', response.data.networkName);
  console.log('Estado:', response.data.isActive ? 'Activa por defecto' : 'Inactiva');
};

// Ejemplo 5: Actualizar configuración de red WiFi
export const updateWifiNetwork = async (id: string) => {
  const updateData: UpdateWifiNetworkRequest = {
    description: "Red WiFi principal para empleados - Actualizada",
    password: "NuevaPassword2024!",
    isActive: true
  };
  
  const response = await dataProvider.update<WifiNetwork>({
    resource: "wifi",
    id,
    variables: updateData
  });
  
  console.log('Red WiFi actualizada:', response.data);
  console.log('Nueva descripción:', response.data.description);
  console.log('Última actualización:', new Date(response.data.updatedAt).toLocaleDateString());
};

// Ejemplo 6: Activar/Desactivar red WiFi
export const toggleWifiNetworkStatus = async (id: string, currentStatus: boolean) => {
  const response = await dataProvider.update<WifiNetwork>({
    resource: "wifi",
    id,
    variables: {
      isActive: !currentStatus
    }
  });
  
  console.log(`Red WiFi ${!currentStatus ? 'activada' : 'desactivada'}:`, response.data.networkName);
  console.log('Nuevo estado:', response.data.isActive ? 'Activa' : 'Inactiva');
};

// Ejemplo 7: Crear múltiples redes WiFi
export const createMultipleWifiNetworks = async () => {
  const networks: CreateWifiNetworkRequest[] = [
    {
      networkName: "ADN_Employees",
      password: "EmpSecure2024",
      description: "Red principal para empleados"
    },
    {
      networkName: "ADN_Guests",
      password: "GuestAccess2024",
      description: "Red para visitantes y clientes"
    },
    {
      networkName: "ADN_IoT",
      description: "Red para dispositivos IoT de la oficina"
    }
  ];
  
  const responses = await Promise.all(
    networks.map(network => 
      dataProvider.create<WifiNetwork>({
        resource: "wifi",
        variables: network
      })
    )
  );
  
  console.log('Redes WiFi creadas:');
  responses.forEach((response, index) => {
    console.log(`${index + 1}. ${response.data.networkName} - ID: ${response.data.id}`);
  });
};

// Ejemplo 8: Buscar redes WiFi por nombre
export const searchWifiNetworksByName = async (searchTerm: string) => {
  // Nota: Este ejemplo asume que el dataProvider maneja filtros de búsqueda
  // La implementación real puede variar según la API
  const response = await dataProvider.custom<WifiNetwork[]>({
    url: `/config/wifi?networkName=${encodeURIComponent(searchTerm)}`,
    method: "get"
  });
  
  console.log(`Redes encontradas con "${searchTerm}":`, response.data);
  
  response.data.forEach(network => {
    console.log(`🔍 ${network.networkName}`);
    if (network.description) {
      console.log(`   ${network.description}`);
    }
  });
};

// Ejemplo 9: Eliminar red WiFi (si la API lo soporta)
export const deleteWifiNetwork = async (id: string) => {
  try {
    const response = await dataProvider.deleteOne({
      resource: "wifi",
      id
    });
    
    console.log('Red WiFi eliminada exitosamente');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar red WiFi:', error);
    // Como alternativa, desactivar la red
    return await toggleWifiNetworkStatus(id, true);
  }
};

// Ejemplo 10: Gestión de códigos QR
export const updateWifiQRCode = async (id: string, qrCodeBase64: string) => {
  const response = await dataProvider.update<WifiNetwork>({
    resource: "wifi",
    id,
    variables: {
      qrCode: qrCodeBase64
    }
  });
  
  console.log('Código QR actualizado para red:', response.data.networkName);
  console.log('QR guardado:', response.data.qrCode ? 'Sí' : 'No');
};

// Ejemplo 11: Obtener estadísticas de redes WiFi
export const getWifiNetworkStats = async () => {
  const allNetworks = await dataProvider.getList<WifiNetwork>({
    resource: "wifi",
    pagination: { current: 1, pageSize: 100 }
  });
  
  const stats = {
    total: allNetworks.total,
    active: 0,
    inactive: 0,
    withPassword: 0,
    withoutPassword: 0,
    withQR: 0,
    withoutQR: 0
  };
  
  allNetworks.data.forEach(network => {
    if (network.isActive) stats.active++;
    else stats.inactive++;
    
    if (network.password) stats.withPassword++;
    else stats.withoutPassword++;
    
    if (network.qrCode) stats.withQR++;
    else stats.withoutQR++;
  });
  
  console.log('Estadísticas de redes WiFi:', stats);
  console.log(`📊 Total: ${stats.total}`);
  console.log(`✅ Activas: ${stats.active} | ❌ Inactivas: ${stats.inactive}`);
  console.log(`🔒 Con contraseña: ${stats.withPassword} | 🔓 Sin contraseña: ${stats.withoutPassword}`);
  console.log(`📱 Con QR: ${stats.withQR} | 📋 Sin QR: ${stats.withoutQR}`);
  
  return stats;
};

// Ejemplo 12: Validaciones antes de crear/actualizar
export const validateAndCreateWifiNetwork = async (networkData: CreateWifiNetworkRequest) => {
  // Validaciones del lado cliente
  if (!networkData.networkName || networkData.networkName.trim().length === 0) {
    throw new Error('El nombre de la red es requerido');
  }
  
  if (networkData.networkName.length > 50) {
    throw new Error('El nombre de la red no puede exceder 50 caracteres');
  }
  
  if (networkData.password && networkData.password.length < 8) {
    console.warn('Contraseña muy corta, se recomienda al menos 8 caracteres');
  }
  
  if (networkData.qrCode && !networkData.qrCode.startsWith('data:image/')) {
    console.warn('El QR Code debería ser una imagen en formato base64');
  }
  
  try {
    const response = await dataProvider.create<WifiNetwork>({
      resource: "wifi",
      variables: networkData
    });
    
    console.log('✅ Red WiFi creada y validada:', response.data.networkName);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear red WiFi:', error);
    throw error;
  }
};

// Ejemplo 13: Operaciones por lotes (bulk operations)
export const bulkUpdateWifiNetworks = async (updates: Array<{id: string, data: UpdateWifiNetworkRequest}>) => {
  const results = await Promise.allSettled(
    updates.map(({ id, data }) =>
      dataProvider.update<WifiNetwork>({
        resource: "wifi",
        id,
        variables: data
      })
    )
  );
  
  const successful = results.filter(result => result.status === 'fulfilled').length;
  const failed = results.filter(result => result.status === 'rejected').length;
  
  console.log(`Actualización en lote completada:`);
  console.log(`✅ Exitosas: ${successful}`);
  console.log(`❌ Fallidas: ${failed}`);
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Error en actualización ${index + 1}:`, result.reason);
    }
  });
  
  return { successful, failed, results };
};

// Ejemplo 14: Uso con hooks de Refine (ejemplo conceptual)
/*
import { useList, useOne, useCreate, useUpdate, useDelete, useCustom } from "@refinedev/core";

// En un componente React
export const WifiNetworksList = () => {
  // Obtener lista de redes WiFi
  const { data: wifiNetworks, isLoading } = useList<WifiNetwork>({
    resource: "wifi",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true,
      }
    ],
    sorters: [
      {
        field: "networkName",
        order: "asc",
      }
    ]
  });

  // Crear red WiFi
  const { mutate: createNetwork } = useCreate<WifiNetwork>();

  // Actualizar red WiFi
  const { mutate: updateNetwork } = useUpdate<WifiNetwork>();

  // Eliminar red WiFi
  const { mutate: deleteNetwork } = useDelete();

  const handleCreateNetwork = (networkData: CreateWifiNetworkRequest) => {
    createNetwork({
      resource: "wifi",
      variables: networkData
    });
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateNetwork({
      resource: "wifi",
      id,
      variables: { isActive: !currentStatus }
    });
  };

  return (
    <div className="wifi-networks-container">
      <h2>Gestión de Redes WiFi</h2>
      
      {isLoading ? (
        <p>Cargando redes WiFi...</p>
      ) : (
        <div className="networks-grid">
          {wifiNetworks?.data.map((network) => (
            <div key={network.id} className={`network-card ${network.isActive ? 'active' : 'inactive'}`}>
              <div className="network-header">
                <h3>{network.networkName}</h3>
                <span className={`status-badge ${network.isActive ? 'active' : 'inactive'}`}>
                  {network.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              
              {network.description && (
                <p className="network-description">{network.description}</p>
              )}
              
              <div className="network-details">
                <div className="detail-item">
                  <span className="detail-label">Contraseña:</span>
                  <span className="detail-value">
                    {network.password ? '🔒 Protegida' : '🔓 Abierta'}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Código QR:</span>
                  <span className="detail-value">
                    {network.qrCode ? '📱 Disponible' : '📋 No disponible'}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Creada:</span>
                  <span className="detail-value">
                    {new Date(network.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="network-actions">
                <button 
                  onClick={() => handleToggleStatus(network.id, network.isActive)}
                  className={`toggle-button ${network.isActive ? 'deactivate' : 'activate'}`}
                >
                  {network.isActive ? 'Desactivar' : 'Activar'}
                </button>
                
                <button 
                  onClick={() => updateNetwork({
                    resource: "wifi",
                    id: network.id,
                    variables: { 
                      description: `${network.description || ''} - Actualizada ${new Date().toLocaleDateString()}`
                    }
                  })}
                  className="update-button"
                >
                  Actualizar
                </button>
                
                {network.qrCode && (
                  <button 
                    onClick={() => {
                      // Mostrar QR code en modal o nueva ventana
                      const qrWindow = window.open('', '_blank');
                      qrWindow?.document.write(`
                        <html>
                          <head><title>QR Code - ${network.networkName}</title></head>
                          <body style="text-align: center; padding: 20px;">
                            <h2>${network.networkName}</h2>
                            <img src="${network.qrCode}" alt="QR Code" style="max-width: 300px;" />
                          </body>
                        </html>
                      `);
                    }}
                    className="qr-button"
                  >
                    Ver QR
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
*/
