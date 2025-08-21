// Ejemplos de uso del servicio y proveedor de departamentos
// Este archivo no se ejecuta, solo sirve como referencia

import { dataProvider } from '../dataProvider';
import type { 
  DepartmentListItem,
  DepartmentDetailed,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  MyDepartment 
} from '../types/departments';

// Ejemplo 1: Obtener lista de departamentos con filtros
export const getFilteredDepartments = async () => {
  const response = await dataProvider.getList<DepartmentListItem>({
    resource: "departments",
    pagination: {
      current: 1,
      pageSize: 10
    },
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true
      },
      {
        field: "search",
        operator: "contains",
        value: "tecnología"
      }
    ]
  });
  
  console.log('Departamentos encontrados:', response.data);
  console.log('Total:', response.total);
};

// Ejemplo 2: Obtener un departamento específico
export const getDepartment = async (id: string) => {
  const response = await dataProvider.getOne<DepartmentDetailed>({
    resource: "departments",
    id
  });
  
  console.log('Departamento:', response.data);
  console.log('Usuarios en el departamento:', response.data.users);
  console.log('Tarjetas del departamento:', response.data.cards);
};

// Ejemplo 3: Crear un nuevo departamento
export const createDepartment = async () => {
  const newDepartment: CreateDepartmentRequest = {
    name: "Inteligencia Artificial",
    slug: "ia", // Opcional, se genera automáticamente si no se proporciona
    description: "Departamento especializado en IA y Machine Learning",
    isActive: true
  };
  
  const response = await dataProvider.create<DepartmentDetailed>({
    resource: "departments",
    variables: newDepartment
  });
  
  console.log('Departamento creado:', response.data);
};

// Ejemplo 4: Actualizar un departamento
export const updateDepartment = async (id: string) => {
  const updateData: UpdateDepartmentRequest = {
    description: "Departamento de Inteligencia Artificial y Aprendizaje Automático",
    isActive: true
  };
  
  const response = await dataProvider.update<DepartmentDetailed>({
    resource: "departments",
    id,
    variables: updateData
  });
  
  console.log('Departamento actualizado:', response.data);
};

// Ejemplo 5: Eliminar un departamento
export const deleteDepartment = async (id: string) => {
  const response = await dataProvider.deleteOne({
    resource: "departments",
    id
  });
  
  console.log('Departamento eliminado:', response.data);
};

// Ejemplo 6: Obtener departamento por slug usando operación personalizada
export const getDepartmentBySlug = async (slug: string) => {
  const response = await dataProvider.custom<DepartmentDetailed>({
    url: `/departments/slug/${slug}`,
    method: "get"
  });
  
  console.log('Departamento por slug:', response.data);
};

// Ejemplo 7: Obtener mis departamentos
export const getMyDepartments = async () => {
  const response = await dataProvider.custom<MyDepartment[]>({
    url: "/departments/my-departments",
    method: "get"
  });
  
  console.log('Mis departamentos:', response.data);
  response.data.forEach(item => {
    console.log(`- ${item.department.name} (${item.assignment.isHead ? 'Jefe' : 'Miembro'})`);
  });
};

// Ejemplo 8: Asignar usuario a departamento
export const assignUserToDepartment = async (departmentId: string, userId: string) => {
  const response = await dataProvider.custom({
    url: `/departments/${departmentId}/users/${userId}`,
    method: "post",
    payload: {
      isHead: false,
      message: "Asignación desde el panel de administración"
    }
  });
  
  console.log('Usuario asignado:', response.data);
};

// Ejemplo 9: Obtener tarjetas de un departamento
export const getDepartmentCards = async (departmentId: string) => {
  const response = await dataProvider.custom({
    url: `/departments/${departmentId}/cards`,
    method: "get"
  });
  
  console.log('Tarjetas del departamento:', response.data);
};

// Ejemplo 10: Asignar tarjeta a departamento
export const assignCardToDepartment = async (departmentId: string, cardId: string) => {
  const response = await dataProvider.custom({
    url: `/departments/${departmentId}/cards/${cardId}`,
    method: "post",
    payload: {
      canEdit: true,
      canDelete: false,
      message: "Tarjeta asignada para gestión del departamento"
    }
  });
  
  console.log('Tarjeta asignada:', response.data);
};

// Ejemplo 11: Operaciones en lote
export const bulkCreateDepartments = async () => {
  const departments: CreateDepartmentRequest[] = [
    {
      name: "Recursos Humanos",
      slug: "rrhh",
      description: "Gestión del talento humano"
    },
    {
      name: "Marketing Digital",
      slug: "marketing-digital",
      description: "Estrategias de marketing online"
    }
  ];
  
  const response = await dataProvider.createMany<DepartmentDetailed>({
    resource: "departments",
    variables: departments
  });
  
  console.log('Departamentos creados en lote:', response.data);
};

// Ejemplo 12: Uso con hooks de Refine (ejemplo conceptual)
/*
import { useList, useOne, useCreate, useUpdate, useDelete, useCustom } from "@refinedev/core";

// En un componente React
export const DepartmentsList = () => {
  // Obtener lista con paginación y filtros automáticos
  const { data, isLoading } = useList<DepartmentListItem>({
    resource: "departments",
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: [
      {
        field: "isActive",
        operator: "eq",
        value: true,
      }
    ]
  });

  // Obtener mis departamentos
  const { data: myDepartments } = useCustom<MyDepartment[]>({
    url: "/departments/my-departments",
    method: "get",
  });

  // Crear departamento
  const { mutate: createDepartment } = useCreate<DepartmentDetailed>();

  // Actualizar departamento
  const { mutate: updateDepartment } = useUpdate<DepartmentDetailed>();

  // Eliminar departamento
  const { mutate: deleteDepartment } = useDelete();

  return (
    <div>
      {isLoading ? (
        <p>Cargando departamentos...</p>
      ) : (
        <ul>
          {data?.data.map((dept) => (
            <li key={dept.id}>
              {dept.name} - {dept._count.users} usuarios, {dept._count.cards} tarjetas
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
*/
