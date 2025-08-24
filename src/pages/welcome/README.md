# Página de Bienvenida para Todos los Usuarios

## Descripción

Esta página es la página principal de bienvenida para todos los usuarios autenticados en el sistema ADN. Todos los usuarios, independientemente de su rol, serán redirigidos a esta página después del login.

## Características

- **Sin Layout Completo**: No incluye el menú lateral ni la cabecera del sistema
- **Diseño Minimalista**: Interfaz limpia y centrada en el contenido
- **Información Personalizada**: Muestra el nombre, email y rol del usuario logueado
- **Botón de Administración Condicional**: Solo visible para usuarios con permisos de RRHH o superiores

## Estructura de Archivos

```
src/pages/welcome/
├── index.tsx          # Componente principal de la página
├── index.ts           # Archivo de exportación
└── README.md          # Esta documentación
```

## Lógica de Permisos

### Todos los Usuarios:
- `USUARIO` - Usuario básico del sistema
- `JEFE_DEPARTAMENTO` - Jefe de departamento
- `RRHH` - Recursos humanos
- `CEO` - Director ejecutivo
- `ADMIN` - Administrador del sistema

### Funcionalidades por Rol:
- **Usuarios básicos** (`USUARIO`, `JEFE_DEPARTAMENTO`): Solo ven la página de bienvenida
- **Usuarios administrativos** (`RRHH`, `CEO`, `ADMIN`): Ven la página de bienvenida + botón de administración

## Implementación Técnica

### Componente PermissionBasedRedirect
- Redirige a todos los usuarios autenticados a la página de bienvenida
- Se ejecuta en la ruta raíz (`/`) y en rutas externas
- Utiliza el hook `usePermissions` de Refine.dev

### Ruta `/welcome`
- Ruta independiente que no usa `ThemedLayoutV2`
- Muestra el componente `Welcome` con funcionalidades condicionales
- Protegida por autenticación pero sin restricciones de layout
- Incluye botón de administración para usuarios con permisos adecuados

## Uso

1. **Login del Usuario**: El usuario se autentica normalmente
2. **Redirección Automática**: Todos los usuarios van a `/welcome`
3. **Verificación de Permisos**: El sistema verifica el rol del usuario
4. **Visualización**: 
   - Todos ven la página de bienvenida sin menú lateral ni cabecera
   - Usuarios con permisos de RRHH o superiores ven botón de administración

## Personalización

El componente `Welcome` puede ser personalizado para:
- Cambiar el diseño visual
- Agregar más información del usuario
- Incluir enlaces útiles
- Modificar el mensaje de bienvenida
- Agregar más funcionalidades condicionales basadas en permisos

## Consideraciones de Seguridad

- Solo usuarios autenticados pueden acceder
- La verificación de permisos se realiza en el cliente y servidor
- Los usuarios no pueden manipular la URL para acceder a funcionalidades restringidas
