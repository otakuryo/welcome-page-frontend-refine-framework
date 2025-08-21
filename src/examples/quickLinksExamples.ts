// Ejemplos de uso del servicio y proveedor de enlaces rápidos (QuickLinks)
// Este archivo no se ejecuta, solo sirve como referencia

import { dataProvider } from '../dataProvider';
import type { 
  QuickLink,
  CreateQuickLinkRequest,
  UpdateQuickLinkRequest,
  QuickLinksListQuery
} from '../types/quicklinks';

// Ejemplo 1: Obtener lista de enlaces rápidos con filtros
export const getFilteredQuickLinks = async () => {
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "category",
        operator: "eq",
        value: "Recursos Humanos"
      },
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('Enlaces encontrados:', response.data);
  console.log('Total:', response.total);
  
  response.data.forEach(link => {
    console.log(`- ${link.title} (${link.category || 'Sin categoría'}) - ${link.url}`);
  });
};

// Ejemplo 2: Obtener todos los enlaces activos
export const getActiveQuickLinks = async () => {
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('Enlaces activos:', response.data);
  
  // Agrupar por categoría
  const linksByCategory = response.data.reduce((acc, link) => {
    const category = link.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);
  
  Object.entries(linksByCategory).forEach(([category, links]) => {
    console.log(`\n📁 ${category}:`);
    links.forEach(link => {
      console.log(`  🔗 ${link.title} - ${link.url}`);
    });
  });
};

// Ejemplo 3: Obtener un enlace específico
export const getQuickLink = async (id: string) => {
  const response = await dataProvider.getOne<QuickLink>({
    resource: "quick-links",
    id
  });
  
  console.log('Enlace:', response.data);
  console.log('URL:', response.data.url);
  console.log('Descripción:', response.data.description);
  console.log('Orden:', response.data.sortOrder);
  console.log('Creado:', new Date(response.data.createdAt).toLocaleDateString());
};

// Ejemplo 4: Crear un nuevo enlace rápido
export const createQuickLink = async () => {
  const newLink: CreateQuickLinkRequest = {
    title: "Portal de Recursos Humanos",
    url: "https://rrhh.adn.com",
    description: "Acceso al portal de gestión de recursos humanos para empleados",
    category: "Recursos Humanos",
    iconUrl: "https://example.com/icons/rrhh.png",
    sortOrder: 5
  };
  
  const response = await dataProvider.create<QuickLink>({
    resource: "quick-links",
    variables: newLink
  });
  
  console.log('Enlace creado:', response.data);
  console.log('ID:', response.data.id);
  console.log('Fecha de creación:', response.data.createdAt);
};

// Ejemplo 5: Actualizar un enlace rápido
export const updateQuickLink = async (id: string) => {
  const updateData: UpdateQuickLinkRequest = {
    title: "Portal Avanzado de RRHH",
    description: "Portal mejorado con nuevas funcionalidades de autogestión",
    isActive: true,
    sortOrder: 1 // Mover al principio
  };
  
  const response = await dataProvider.update<QuickLink>({
    resource: "quick-links",
    id,
    variables: updateData
  });
  
  console.log('Enlace actualizado:', response.data);
  console.log('Última actualización:', response.data.updatedAt);
};

// Ejemplo 6: Eliminar un enlace rápido
export const deleteQuickLink = async (id: string) => {
  const response = await dataProvider.deleteOne({
    resource: "quick-links",
    id
  });
  
  console.log('Enlace eliminado:', response.data);
};

// Ejemplo 7: Crear enlaces en lote
export const bulkCreateQuickLinks = async () => {
  const links: CreateQuickLinkRequest[] = [
    {
      title: "Sistema ERP",
      url: "https://erp.adn.com",
      description: "Acceso al sistema de planificación de recursos empresariales",
      category: "Sistemas Principales",
      iconUrl: "https://example.com/icons/erp.png",
      sortOrder: 1
    },
    {
      title: "Portal de Empleados",
      url: "https://empleados.adn.com",
      description: "Portal de autogestión para empleados",
      category: "Recursos Humanos",
      iconUrl: "https://example.com/icons/empleados.png",
      sortOrder: 2
    },
    {
      title: "Sistema de Tickets",
      url: "https://tickets.adn.com",
      description: "Gestión de incidencias y solicitudes de soporte",
      category: "Soporte Técnico",
      iconUrl: "https://example.com/icons/tickets.png",
      sortOrder: 3
    },
    {
      title: "Webmail Corporativo",
      url: "https://mail.adn.com",
      description: "Acceso al correo electrónico corporativo",
      category: "Comunicación",
      iconUrl: "https://example.com/icons/mail.png",
      sortOrder: 4
    }
  ];
  
  // Crear enlaces uno por uno usando createMany si está disponible
  // o crear individualmente en un bucle
  for (const link of links) {
    try {
      const response = await dataProvider.create<QuickLink>({
        resource: "quick-links",
        variables: link
      });
      console.log(`✅ ${link.title} - ID: ${response.data.id}`);
    } catch (error) {
      console.error(`❌ Error creando ${link.title}:`, error);
    }
  }
};

// Ejemplo 8: Gestionar enlaces por categoría
export const manageLinksbyCategory = async (category: string) => {
  // Obtener enlaces de una categoría específica
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "category",
        operator: "eq",
        value: category
      }
    ]
  });
  
  console.log(`Enlaces en categoría "${category}":`, response.data);
  
  // Activar todos los enlaces de la categoría
  for (const link of response.data) {
    if (!link.isActive) {
      await dataProvider.update<QuickLink>({
        resource: "quick-links",
        id: link.id,
        variables: { isActive: true }
      });
      console.log(`✅ Activado: ${link.title}`);
    }
  }
  
  return response.data;
};

// Ejemplo 9: Reorganizar orden de enlaces
export const reorderQuickLinks = async (linkIds: string[], startOrder: number = 1) => {
  for (let i = 0; i < linkIds.length; i++) {
    const newOrder = startOrder + i;
    
    try {
      await dataProvider.update<QuickLink>({
        resource: "quick-links",
        id: linkIds[i],
        variables: { sortOrder: newOrder }
      });
      console.log(`✅ Enlace ${linkIds[i]} ahora tiene orden ${newOrder}`);
    } catch (error) {
      console.error(`❌ Error reordenando enlace ${linkIds[i]}:`, error);
    }
  }
};

// Ejemplo 10: Buscar enlaces por URL o título
export const searchQuickLinks = async (searchTerm: string) => {
  // Obtener todos los enlaces y filtrar localmente
  // (ya que la API no soporta búsqueda de texto según el OpenAPI)
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  const searchResults = response.data.filter(link => 
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (link.description && link.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  console.log(`Resultados de búsqueda para "${searchTerm}":`, searchResults);
  
  searchResults.forEach(link => {
    console.log(`🔍 ${link.title} - ${link.url}`);
    if (link.description) {
      console.log(`   📝 ${link.description}`);
    }
  });
  
  return searchResults;
};

// Ejemplo 11: Obtener estadísticas de enlaces
export const getQuickLinksStats = async () => {
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links"
  });
  
  const stats = {
    total: response.data.length,
    active: response.data.filter(link => link.isActive).length,
    inactive: response.data.filter(link => !link.isActive).length,
    withIcon: response.data.filter(link => link.iconUrl).length,
    withDescription: response.data.filter(link => link.description).length,
    byCategory: {} as Record<string, number>
  };
  
  // Contar por categorías
  response.data.forEach(link => {
    const category = link.category || 'Sin categoría';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
  });
  
  console.log('📊 Estadísticas de Enlaces Rápidos:');
  console.log(`Total: ${stats.total}`);
  console.log(`Activos: ${stats.active}`);
  console.log(`Inactivos: ${stats.inactive}`);
  console.log(`Con icono: ${stats.withIcon}`);
  console.log(`Con descripción: ${stats.withDescription}`);
  console.log('\n📁 Por categoría:');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  
  return stats;
};

// Ejemplo 12: Validar enlaces (verificar URLs)
export const validateQuickLinks = async () => {
  const response = await dataProvider.getList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('🔍 Validando enlaces...');
  
  for (const link of response.data) {
    try {
      // Validación básica de URL
      const url = new URL(link.url);
      console.log(`✅ ${link.title} - URL válida: ${url.origin}`);
      
      // Aquí podrías agregar una verificación HTTP real si fuera necesario
      // const httpResponse = await fetch(link.url, { method: 'HEAD' });
      
    } catch (error) {
      console.log(`❌ ${link.title} - URL inválida: ${link.url}`);
      
      // Marcar como inactivo si la URL es inválida
      await dataProvider.update<QuickLink>({
        resource: "quick-links",
        id: link.id,
        variables: { isActive: false }
      });
    }
  }
};

// Ejemplo 13: Uso con hooks de Refine (ejemplo conceptual)
/*
import { useList, useOne, useCreate, useUpdate, useDelete } from "@refinedev/core";

// En un componente React
export const QuickLinksManager = () => {
  // Obtener lista con filtros automáticos
  const { data, isLoading, refetch } = useList<QuickLink>({
    resource: "quick-links",
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true,
      }
    ]
  });

  // Crear enlace
  const { mutate: createLink, isLoading: isCreating } = useCreate<QuickLink>();

  // Actualizar enlace
  const { mutate: updateLink } = useUpdate<QuickLink>();

  // Eliminar enlace
  const { mutate: deleteLink } = useDelete();

  const handleCreateLink = (linkData: CreateQuickLinkRequest) => {
    createLink({
      resource: "quick-links",
      variables: linkData
    }, {
      onSuccess: () => {
        console.log('Enlace creado exitosamente');
        refetch();
      }
    });
  };

  const handleToggleActive = (linkId: string, isActive: boolean) => {
    updateLink({
      resource: "quick-links",
      id: linkId,
      variables: { isActive: !isActive }
    }, {
      onSuccess: () => {
        console.log('Estado del enlace actualizado');
        refetch();
      }
    });
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
      deleteLink({
        resource: "quick-links",
        id: linkId
      }, {
        onSuccess: () => {
          console.log('Enlace eliminado');
          refetch();
        }
      });
    }
  };

  return (
    <div className="quick-links-manager">
      <h2>Gestión de Enlaces Rápidos</h2>
      
      {isLoading ? (
        <p>Cargando enlaces...</p>
      ) : (
        <div className="links-grid">
          {data?.data.map((link) => (
            <div key={link.id} className="link-card">
              <div className="link-header">
                <h3>{link.title}</h3>
                {link.iconUrl && (
                  <img src={link.iconUrl} alt={link.title} className="link-icon" />
                )}
              </div>
              
              <p className="link-description">{link.description}</p>
              <p className="link-url">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </p>
              
              <div className="link-meta">
                <span className="category">{link.category || 'Sin categoría'}</span>
                <span className="order">Orden: {link.sortOrder}</span>
                <span className={`status ${link.isActive ? 'active' : 'inactive'}`}>
                  {link.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="link-actions">
                <button 
                  onClick={() => handleToggleActive(link.id, link.isActive)}
                  className={link.isActive ? 'btn-deactivate' : 'btn-activate'}
                >
                  {link.isActive ? 'Desactivar' : 'Activar'}
                </button>
                
                <button 
                  onClick={() => handleDeleteLink(link.id)}
                  className="btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => handleCreateLink({
          title: "Nuevo Enlace",
          url: "https://ejemplo.com",
          description: "Descripción del nuevo enlace",
          category: "General"
        })}
        disabled={isCreating}
        className="btn-create"
      >
        {isCreating ? 'Creando...' : 'Crear Enlace'}
      </button>
    </div>
  );
};
*/
