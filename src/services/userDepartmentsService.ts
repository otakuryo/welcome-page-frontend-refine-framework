// Servicio especializado para gestión de departamentos de usuarios (SRP)
// Depende de DepartmentsService (DIP)
import { DepartmentsService } from './departmentsService';
import type { 
  UserDepartmentAssignment, 
  AssignUserToDepartmentRequest,
  MyDepartment,
  DepartmentListItem 
} from '../types/departments';
import type { ApiResponse } from '../types/auth';
import { ApiService } from './apiService';
import { AuthService } from './authService';


export class UserDepartmentsService {
  private readonly departmentsService: DepartmentsService;

  private readonly apiService: ApiService;
  private readonly authService: AuthService;
  private readonly token: string;

  constructor(departmentsService: DepartmentsService) {
    this.departmentsService = departmentsService;
    this.apiService = new ApiService();
    this.authService = new AuthService(this.apiService);
    this.token = this.authService.getToken() || '';
  }

  /**
   * Obtiene todos los departamentos disponibles para asignación
   */
  async getAvailableDepartments(): Promise<DepartmentListItem[]> {
    try {
      if (!this.token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await this.departmentsService.listDepartments(
        { isActive: "true", limit: 100 },
        this.token
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo departamentos disponibles:', error);
      throw error;
    }
  }

  /**
   * Obtiene los departamentos actuales de un usuario específico
   */
  async getUserDepartments(userId: string): Promise<MyDepartment[]> {
    try {
      if (!this.token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const allDepartments = await this.departmentsService.getUserDepartments(userId, this.token);
      return allDepartments.data;
    } catch (error) {
      console.error('Error obteniendo departamentos del usuario:', error);
      throw error;
    }
  }

  /**
   * Asigna un usuario a un departamento
   */
  async assignUserToDepartment(
    departmentId: string,
    userId: string,
    options: AssignUserToDepartmentRequest = {}
  ): Promise<UserDepartmentAssignment> {
    try {
      const response = await this.departmentsService.assignUserToDepartment(
        departmentId,
        userId,
        options,
        this.token
      );
      return response.data;
    } catch (error) {
      console.error('Error asignando usuario a departamento:', error);
      throw error;
    }
  }

  /**
   * Desasigna un usuario de un departamento
   */
  async removeUserFromDepartment(
    departmentId: string,
    userId: string
  ): Promise<void> {
    try {
      await this.departmentsService.removeUserFromDepartment(
        departmentId,
        userId,
        this.token
      );
    } catch (error) {
      console.error('Error removiendo usuario de departamento:', error);
      throw error;
    }
  }

  /**
   * Actualiza las asignaciones de departamentos de un usuario
   * Utiliza Promise.all para operaciones concurrentes cuando es posible
   */
  async updateUserDepartments(
    userId: string,
    currentDepartments: MyDepartment[],
    selectedDepartmentIds: string[]
  ): Promise<UserDepartmentAssignment[]> {
    try {
      const currentDepartmentIds = currentDepartments.map(d => d.department.id);
      
      // Departamentos a agregar (están en selectedDepartmentIds pero no en currentDepartmentIds)
      const toAdd = selectedDepartmentIds.filter(id => !currentDepartmentIds.includes(id));
      
      // Departamentos a remover (están en currentDepartmentIds pero no en selectedDepartmentIds)
      const toRemove = currentDepartmentIds.filter(id => !selectedDepartmentIds.includes(id));

      // Ejecutar operaciones en paralelo para mejor performance
      const operations: Promise<any>[] = [];

      // Agregar asignaciones
      toAdd.forEach(departmentId => {
        operations.push(
          this.assignUserToDepartment(departmentId, userId, { isHead: false })
        );
      });

      // Remover asignaciones
      toRemove.forEach(departmentId => {
        operations.push(
          this.removeUserFromDepartment(departmentId, userId)
        );
      });

      // Ejecutar todas las operaciones
      const results = await Promise.allSettled(operations);
      
      // Verificar si alguna operación falló
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        console.error('Algunas operaciones fallaron:', failures);
        // Opcional: lanzar error o manejar parcialmente
        throw new Error(`${failures.length} operaciones fallaron`);
      }

      // Obtener y retornar las asignaciones actualizadas
      const updatedDepartments = await this.getUserDepartments(userId);
      return updatedDepartments.map(ud => ({
        id: ud.assignment.id,
        userId: userId,
        departmentId: ud.department.id,
        isHead: ud.assignment.isHead,
        joinedAt: ud.assignment.joinedAt,
        isActive: true
      }));

    } catch (error) {
      console.error('Error actualizando departamentos del usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza el rol de jefe de departamento para un usuario
   */
  async updateUserDepartmentRole(
    departmentId: string,
    userId: string,
    isHead: boolean
  ): Promise<UserDepartmentAssignment> {
    try {
      // Primero removemos la asignación actual
      await this.removeUserFromDepartment(departmentId, userId);
      
      // Luego creamos una nueva con el rol actualizado
      return await this.assignUserToDepartment(
        departmentId,
        userId,
        { isHead }
      );
    } catch (error) {
      console.error('Error actualizando rol de departamento:', error);
      throw error;
    }
  }
}
