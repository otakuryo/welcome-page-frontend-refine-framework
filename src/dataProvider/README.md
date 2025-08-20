# Data Provider

Este directorio contiene la implementación del Data Provider para Refine, siguiendo los principios SOLID y las mejores prácticas de la documentación oficial.

## Estructura

```
dataProvider/
├── index.ts          # Data Provider principal
├── config.ts         # Configuración y constantes
├── errorHandler.ts   # Manejo de errores
├── filterHandler.ts  # Manejo de filtros
└── README.md         # Documentación
```

## Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)
- **`index.ts`**: Responsable únicamente de implementar la interfaz DataProvider de Refine
- **`config.ts`**: Responsable únicamente de la configuración y constantes
- **`errorHandler.ts`**: Responsable únicamente del manejo de errores
- **`filterHandler.ts`**: Responsable únicamente del procesamiento de filtros

### 2. Open/Closed Principle (OCP)
- El sistema está abierto para extensión (nuevos recursos) pero cerrado para modificación
- Los manejadores de errores y filtros pueden extenderse sin modificar el código existente

### 3. Liskov Substitution Principle (LSP)
- Todos los tipos implementan correctamente las interfaces de Refine
- Los tipos genéricos se manejan apropiadamente con `BaseRecord`

### 4. Interface Segregation Principle (ISP)
- Cada clase maneja una responsabilidad específica
- Las interfaces están segregadas por funcionalidad

### 5. Dependency Inversion Principle (DIP)
- El data provider depende de abstracciones (interfaces de Refine)
- Los servicios se inyectan como dependencias

## Características

### ✅ Tipos Genéricos Correctos
- Uso apropiado de `TData extends BaseRecord`
- Conversiones de tipos seguras con `as unknown as TData`
- Manejo correcto de tipos de Refine

### ✅ Manejo de Errores Estandarizado
- Todos los errores se convierten a `HttpError` de Refine
- Manejo centralizado de errores en `DataProviderErrorHandler`
- Códigos de estado HTTP apropiados

### ✅ Filtros Implementados Correctamente
- Uso de `CrudFilter` y `CrudOperators` de Refine
- Manejo de filtros de igualdad (`EQ`) y contenido (`CONTAINS`)
- Procesamiento centralizado en `DataProviderFilterHandler`

### ✅ Configuración Centralizada
- Constantes definidas en `DATA_PROVIDER_CONFIG`
- Tipos de configuración exportados
- Fácil mantenimiento y extensión

## Recursos Soportados

### Users
- **getList**: Lista de usuarios con paginación y filtros
- **getOne**: Obtener usuario por ID
- **create**: Crear nuevo usuario
- **update**: Actualizar usuario (rol, estado, información personal)
- **deleteOne**: Desactivar usuario
- **getMany**: Obtener múltiples usuarios por IDs
- **createMany**: Crear múltiples usuarios
- **updateMany**: Actualizar múltiples usuarios (bulk update)
- **deleteMany**: Desactivar múltiples usuarios

## Filtros Soportados

### Users
- `role`: Filtro por rol de usuario
- `department`: Filtro por departamento
- `isActive`: Filtro por estado activo/inactivo
- `search`: Búsqueda en nombre, email o username

## Uso

```typescript
import { dataProvider } from "./dataProvider";

// En App.tsx
<Refine
  dataProvider={dataProvider}
  // ... otras props
>
```

## Extensión

Para agregar nuevos recursos:

1. **Agregar configuración** en `config.ts`
2. **Implementar lógica** en `index.ts`
3. **Agregar filtros** en `filterHandler.ts` si es necesario
4. **Actualizar tipos** en `types/` si es necesario

## Referencias

- [Documentación oficial de Refine Data Provider](https://refine.dev/docs/data/data-provider/)
- [Principios SOLID](https://en.wikipedia.org/wiki/SOLID)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
