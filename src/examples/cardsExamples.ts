// Ejemplos de uso del servicio y proveedor de tarjetas (Cards)
// Este archivo no se ejecuta, solo sirve como referencia

import { dataProvider } from '../dataProvider';
import type { 
  CardListItem,
  FullCard,
  MyCardItem,
  CreateCardRequest,
  UpdateCardRequest,
  UserCardAssignment,
  AssignCardRequest,
  UpdateFeaturedRequest,
  CardType
} from '../types/cards';

// Ejemplo 1: Obtener lista de tarjetas con filtros
export const getFilteredCards = async () => {
  const response = await dataProvider.getList<CardListItem>({
    resource: "cards",
    pagination: {
      current: 1,
      pageSize: 10
    },
    filters: [
      {
        field: "type",
        operator: "eq",
        value: "ERP" as CardType
      },
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('Tarjetas encontradas:', response.data);
  console.log('Total:', response.total);
  
  response.data.forEach(card => {
    console.log(`- ${card.title} (${card.type}) - ${card.assignedUsersCount} usuarios`);
  });
};

// Ejemplo 2: Obtener una tarjeta específica
export const getCard = async (id: string) => {
  const response = await dataProvider.getOne<CardListItem>({
    resource: "cards",
    id
  });
  
  console.log('Tarjeta:', response.data);
  console.log('Creada por:', response.data.createdBy);
  console.log('Orden:', response.data.sortOrder);
};

// Ejemplo 3: Crear una nueva tarjeta
export const createCard = async () => {
  const newCard: CreateCardRequest = {
    title: "Sistema de Control de Horarios",
    description: "Aplicación para gestionar los horarios de entrada y salida del personal",
    type: "CONTROL_TIEMPOS",
    imageUrl: "https://example.com/images/control-horarios.png",
    linkUrl: "https://horarios.adn.com",
    sortOrder: 10
  };
  
  const response = await dataProvider.create<FullCard>({
    resource: "cards",
    variables: newCard
  });
  
  console.log('Tarjeta creada:', response.data);
  console.log('ID:', response.data.id);
  console.log('Fecha de creación:', response.data.createdAt);
};

// Ejemplo 4: Actualizar una tarjeta
export const updateCard = async (id: string) => {
  const updateData: UpdateCardRequest = {
    title: "Sistema Avanzado de Control de Horarios",
    description: "Aplicación mejorada para gestionar horarios con reportes automáticos",
    isActive: true,
    sortOrder: 5
  };
  
  const response = await dataProvider.update<FullCard>({
    resource: "cards",
    id,
    variables: updateData
  });
  
  console.log('Tarjeta actualizada:', response.data);
  console.log('Última actualización:', response.data.updatedAt);
};

// Ejemplo 5: Eliminar una tarjeta (eliminación suave)
export const deleteCard = async (id: string) => {
  const response = await dataProvider.deleteOne({
    resource: "cards",
    id
  });
  
  console.log('Tarjeta eliminada (soft delete):', response.data);
};

// Ejemplo 6: Obtener mis tarjetas asignadas usando operación personalizada
export const getMyCards = async () => {
  const response = await dataProvider.custom<MyCardItem[]>({
    url: "/cards/my-cards",
    method: "get"
  });
  
  console.log('Mis tarjetas:', response.data);
  
  // Separar por destacadas y normales
  const featuredCards = response.data.filter(card => card.isFeatured);
  const normalCards = response.data.filter(card => !card.isFeatured);
  
  console.log('Tarjetas destacadas:', featuredCards.length);
  featuredCards.forEach(card => {
    console.log(`⭐ ${card.title} - ${card.type}`);
  });
  
  console.log('Tarjetas normales:', normalCards.length);
  normalCards.forEach(card => {
    console.log(`- ${card.title} - ${card.type}`);
  });
};

// Ejemplo 7: Asignar tarjeta a usuario
export const assignCardToUser = async (cardId: string, userId: string) => {
  const assignmentData: AssignCardRequest = {
    isFeatured: false,
    customTitle: "Mi ERP Personalizado",
    customDescription: "Acceso personalizado al sistema ERP con permisos específicos"
  };
  
  const response = await dataProvider.custom<UserCardAssignment>({
    url: `/cards/${cardId}/assign/${userId}`,
    method: "post",
    payload: assignmentData
  });
  
  console.log('Tarjeta asignada:', response.data);
  console.log('Fecha de asignación:', response.data.assignedAt);
};

// Ejemplo 8: Desasignar tarjeta de usuario
export const unassignCardFromUser = async (cardId: string, userId: string) => {
  const response = await dataProvider.custom({
    url: `/cards/${cardId}/assign/${userId}`,
    method: "delete"
  });
  
  console.log('Tarjeta desasignada exitosamente');
};

// Ejemplo 9: Marcar/desmarcar tarjeta como destacada
export const toggleCardFeatured = async (cardId: string, isFeatured: boolean) => {
  const featuredData: UpdateFeaturedRequest = {
    isFeatured
  };
  
  const response = await dataProvider.custom<UserCardAssignment>({
    url: `/cards/${cardId}/featured`,
    method: "patch",
    payload: featuredData
  });
  
  console.log(`Tarjeta ${isFeatured ? 'marcada como destacada' : 'removida de destacadas'}:`, response.data);
};

// Ejemplo 10: Eliminación completa de tarjeta (para admins)
export const deleteCardCompletely = async (cardId: string) => {
  const response = await dataProvider.custom({
    url: `/cards/${cardId}/delete`,
    method: "delete"
  });
  
  console.log('Tarjeta eliminada completamente:', response.data);
  console.log('Asignaciones removidas:', response.data.removedAssignments);
};

// Ejemplo 11: Obtener tarjetas por tipo
export const getCardsByType = async (type: CardType) => {
  const response = await dataProvider.getList<CardListItem>({
    resource: "cards",
    filters: [
      {
        field: "type",
        operator: "eq",
        value: type
      },
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ],
    sorters: [
      {
        field: "sortOrder",
        order: "asc"
      }
    ]
  });
  
  console.log(`Tarjetas de tipo ${type}:`, response.data);
  return response.data;
};

// Ejemplo 12: Operaciones en lote
export const bulkCreateCards = async () => {
  const cards: CreateCardRequest[] = [
    {
      title: "Sistema ERP",
      description: "Sistema integrado de gestión empresarial",
      type: "ERP",
      imageUrl: "https://example.com/images/erp.png",
      linkUrl: "https://erp.adn.com",
      sortOrder: 1
    },
    {
      title: "Gestor de Contraseñas",
      description: "Herramienta segura para gestión de credenciales",
      type: "GESTOR_PASSWORDS",
      imageUrl: "https://example.com/images/passwords.png",
      linkUrl: "https://passwords.adn.com",
      sortOrder: 2
    },
    {
      title: "Portal de Programas",
      description: "Acceso a aplicaciones y herramientas de desarrollo",
      type: "PROGRAMAS",
      linkUrl: "https://programas.adn.com",
      sortOrder: 3
    }
  ];
  
  const response = await dataProvider.createMany<FullCard>({
    resource: "cards",
    variables: cards
  });
  
  console.log('Tarjetas creadas en lote:', response.data);
  response.data.forEach(card => {
    console.log(`✅ ${card.title} - ID: ${card.id}`);
  });
};

// Ejemplo 13: Búsqueda y filtrado avanzado
export const advancedCardSearch = async () => {
  // Buscar tarjetas activas de información personal
  const personalInfoCards = await dataProvider.getList<CardListItem>({
    resource: "cards",
    filters: [
      {
        field: "type",
        operator: "eq",
        value: "INFORMACION_PERSONAL"
      },
      {
        field: "isActive",
        operator: "eq",
        value: true
      }
    ]
  });
  
  console.log('Tarjetas de información personal:', personalInfoCards.data);
  
  // Buscar tarjetas por orden específico
  const priorityCards = await dataProvider.getList<CardListItem>({
    resource: "cards",
    sorters: [
      {
        field: "sortOrder",
        order: "asc"
      },
      {
        field: "title",
        order: "asc"
      }
    ],
    pagination: {
      current: 1,
      pageSize: 5
    }
  });
  
  console.log('Top 5 tarjetas por prioridad:', priorityCards.data);
};

// Ejemplo 14: Gestión de estados de tarjetas
export const manageCardStates = async () => {
  // Activar múltiples tarjetas
  const cardIds = ["card-1", "card-2", "card-3"];
  
  const activatedCards = await dataProvider.updateMany({
    resource: "cards",
    ids: cardIds,
    variables: {
      isActive: true
    }
  });
  
  console.log('Tarjetas activadas:', activatedCards.data);
  
  // Desactivar múltiples tarjetas (eliminación suave en lote)
  const deactivatedCards = await dataProvider.deleteMany({
    resource: "cards",
    ids: cardIds
  });
  
  console.log('Tarjetas desactivadas:', deactivatedCards.data);
};

// Ejemplo 15: Uso con hooks de Refine (ejemplo conceptual)
/*
import { useList, useOne, useCreate, useUpdate, useDelete, useCustom } from "@refinedev/core";

// En un componente React
export const CardsList = () => {
  // Obtener lista con paginación y filtros automáticos
  const { data, isLoading } = useList<CardListItem>({
    resource: "cards",
    pagination: {
      current: 1,
      pageSize: 12,
    },
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true,
      }
    ],
    sorters: [
      {
        field: "sortOrder",
        order: "asc",
      }
    ]
  });

  // Obtener mis tarjetas
  const { data: myCards } = useCustom<MyCardItem[]>({
    url: "/cards/my-cards",
    method: "get",
  });

  // Crear tarjeta
  const { mutate: createCard } = useCreate<FullCard>();

  // Actualizar tarjeta
  const { mutate: updateCard } = useUpdate<FullCard>();

  // Eliminar tarjeta
  const { mutate: deleteCard } = useDelete();

  // Marcar como destacada
  const { mutate: toggleFeatured } = useCustom<UserCardAssignment>();

  const handleToggleFeatured = (cardId: string, isFeatured: boolean) => {
    toggleFeatured({
      url: `/cards/${cardId}/featured`,
      method: "patch",
      values: { isFeatured: !isFeatured }
    });
  };

  return (
    <div className="cards-grid">
      {isLoading ? (
        <p>Cargando tarjetas...</p>
      ) : (
        <>
          <div className="my-cards-section">
            <h2>Mis Tarjetas</h2>
            <div className="cards-list">
              {myCards?.data.filter(card => card.isFeatured).map((card) => (
                <div key={card.id} className="card featured">
                  ⭐ {card.title} - {card.type}
                </div>
              ))}
              {myCards?.data.filter(card => !card.isFeatured).map((card) => (
                <div key={card.id} className="card">
                  {card.title} - {card.type}
                </div>
              ))}
            </div>
          </div>
          
          <div className="all-cards-section">
            <h2>Todas las Tarjetas</h2>
            <div className="cards-grid">
              {data?.data.map((card) => (
                <div key={card.id} className="card-item">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className="card-type">{card.type}</span>
                  <span className="users-count">{card.assignedUsersCount} usuarios</span>
                  <div className="card-actions">
                    <button onClick={() => updateCard({
                      resource: "cards",
                      id: card.id,
                      variables: { isActive: !card.isActive }
                    })}>
                      {card.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
*/
