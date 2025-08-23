# Data Provider Custom

Este data provider especializado está diseñado específicamente para manejar la lógica compleja del selector de departamentos y otras funcionalidades custom que requieren operaciones especializadas.

## Estructura

```
dataProvider/
├── dataProviderCustom.ts    # Data Provider custom principal
├── configCustom.ts          # Configuración específica
├── errorHandlerCustom.ts    # Manejo de errores especializado
├── filterHandlerCustom.ts   # Manejo de filtros custom
└── README_CUSTOM.md         # Esta documentación
```

## Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
- **`dataProviderCustom.ts`**: Responsable únicamente de operaciones específicas de departamentos de usuario
- **`configCustom.ts`**: Configuración y constantes específicas
- **`errorHandlerCustom.ts`**: Manejo de errores especializados
- **`filterHandlerCustom.ts`**: Procesamiento de filtros y validaciones

### 2. Open/Closed Principle (OCP)
- Extensible para nuevas operaciones custom sin modificar código existente
- Estructura modular que permite agregar nuevos recursos fácilmente

### 3. Liskov Substitution Principle (LSP)
- Implementa correctamente la interfaz `DataProvider` de Refine
- Compatible con el sistema de tipos de Refine

### 4. Interface Segregation Principle (ISP)
- Cada clase maneja responsabilidades específicas
- Interfaces segregadas por funcionalidad

### 5. Dependency Inversion Principle (DIP)
- Depende de abstracciones (interfaces de Refine)
- Usa servicios existentes como dependencias

## Recursos Soportados

### 1. `user-departments`
**Propósito**: Gestionar departamentos asignados a usuarios específicos

#### Operaciones:
- **getList**: Obtener departamentos de un usuario
  ```typescript
  useList({
    resource: "user-departments",
    filters: [{ field: "userId", operator: "eq", value: "user-123" }]
  })
  ```
  
- **update**: Actualización masiva de departamentos
  ```typescript
  useUpdate({
    resource: "user-departments",
    id: "user-123",
    values: { 
      departmentIds: ["dept-1", "dept-2"], 
      currentDepartments: [...] 
    }
  })
  ```

### 2. `available-departments`
**Propósito**: Obtener departamentos disponibles para asignación

#### Operaciones:
- **getList**: Lista de departamentos activos
  ```typescript
  useList({
    resource: "available-departments",
    pagination: { pageSize: 100 },
    filters: [{ field: "isActive", operator: "eq", value: true }]
  })
  ```

### 3. `department-assignments`
**Propósito**: Gestionar asignaciones individuales de departamento

#### Operaciones:
- **create**: Asignar usuario a departamento
  ```typescript
  useCreate({
    resource: "department-assignments",
    values: { 
      departmentId: "dept-1", 
      userId: "user-123", 
      isHead: false 
    }
  })
  ```
  
- **deleteOne**: Remover usuario de departamento
  ```typescript
  useDelete({
    resource: "department-assignments",
    id: "assignment-id",
    values: { departmentId: "dept-1", userId: "user-123" }
  })
  ```

## Endpoints Custom Soportados

### 1. `/users/{userId}/departments`
- **GET**: Obtener departamentos de un usuario específico
- **Uso**:
  ```typescript
  useCustom({
    url: "/users/user-123/departments",
    method: "get"
  })
  ```

### 2. `/users/{userId}/departments/bulk-update`
- **PUT**: Actualización masiva de departamentos
- **Uso**:
  ```typescript
  useCustom({
    url: "/users/user-123/departments/bulk-update",
    method: "put",
    payload: { 
      departmentIds: ["dept-1", "dept-2"],
      currentDepartments: [...]
    }
  })
  ```

### 3. `/departments/available`
- **GET**: Obtener departamentos disponibles
- **Uso**:
  ```typescript
  useCustom({
    url: "/departments/available",
    method: "get"
  })
  ```

## Uso en el DepartmentSelector

```typescript
import { useList, useCustom, useUpdate } from '@refinedev/core';

// Departamentos disponibles
const { data: availableDepartments, isLoading: loadingDepartments } = useList({
  resource: "available-departments",
  pagination: { pageSize: 100 },
});

// Departamentos del usuario
const { data: userDepartments, isLoading: loadingUserDepts, refetch } = useList({
  resource: "user-departments",
  filters: [{ field: "userId", operator: "eq", value: userId }],
});

// Actualización masiva
const { mutate: updateDepartments } = useUpdate({
  resource: "user-departments",
  successNotification: {
    message: "Departamentos actualizados correctamente",
    type: "success",
  },
});

// Uso
const handleUpdate = (selectedIds: string[]) => {
  updateDepartments({
    id: userId,
    values: { 
      departmentIds: selectedIds,
      currentDepartments: userDepartments?.data || []
    }
  });
};
```

## Ventajas del Data Provider Custom

### ✅ **Especialización**
- Diseñado específicamente para operaciones de departamentos de usuario
- Lógica optimizada para casos de uso específicos
- Validaciones y manejo de errores especializados

### ✅ **Performance**
- Cache automático de Refine para todas las operaciones
- Operaciones optimizadas para bulk updates
- Invalidación inteligente de cache

### ✅ **Mantenibilidad**
- Separación clara de responsabilidades
- Estructura modular y extensible
- Documentación completa

### ✅ **Integración con Refine**
- Compatible 100% con hooks de Refine
- Notificaciones automáticas
- Estados de loading/error automáticos
- Invalidación de cache automática

### ✅ **Reutilización**
- Puede ser usado en múltiples componentes
- Lógica centralizada
- Fácil de testear

## Extensión Futura

Para agregar nuevas funcionalidades:

1. **Agregar nuevo recurso** en `configCustom.ts`
2. **Implementar lógica** en `dataProviderCustom.ts`
3. **Agregar filtros** en `filterHandlerCustom.ts` si es necesario
4. **Agregar manejo de errores** en `errorHandlerCustom.ts` si es necesario
5. **Documentar** en este README

## Referencias

- [Documentación oficial de Refine Data Provider](https://refine.dev/docs/data/data-provider/)
- [Custom Data Provider](https://refine.dev/docs/data/data-provider/#creating-a-data-provider)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
