// hooks/useDepartmentSelector.ts
import { useList, useUpdate } from '@refinedev/core';
import { DepartmentListItem, MyDepartment } from '../types/departments';
import { DATA_PROVIDER_CUSTOM_CONFIG } from '../dataProvider/configCustom';
import { CUSTOM_RESOURCES } from '../dataProvider/indexCustom';
import { useMemo } from 'react';

export const useDepartmentSelector = (userId: string) => {
    const availableDepartmentsQuery = useList<DepartmentListItem>({
      resource: CUSTOM_RESOURCES.AVAILABLE_DEPARTMENTS,
      pagination: { pageSize: DATA_PROVIDER_CUSTOM_CONFIG.DEFAULT_PAGINATION.PAGE_SIZE },
      filters: [{ field: "isActive", operator: "eq", value: true }],
    });
  
    const userDepartmentsQuery = useList<MyDepartment>({
      resource: CUSTOM_RESOURCES.USER_DEPARTMENTS,
      filters: [{ field: "userId", operator: "eq", value: userId }],
      queryOptions: { enabled: Boolean(userId) },
    });
  
    const updateMutation = useUpdate({
      resource: CUSTOM_RESOURCES.USER_DEPARTMENTS,
    });
  
    // Memoizar valores derivados
    const availableDepartments = useMemo(
      () => availableDepartmentsQuery.data?.data || [],
      [availableDepartmentsQuery.data]
    );
  
    const currentUserDepartments = useMemo(
      () => userDepartmentsQuery.data?.data || [],
      [userDepartmentsQuery.data]
    );
  
    return {
      availableDepartments,
      currentUserDepartments,
      isLoading: availableDepartmentsQuery.isLoading || userDepartmentsQuery.isLoading,
      updateDepartments: updateMutation.mutate,
      isUpdating: updateMutation.isLoading,
      refetch: userDepartmentsQuery.refetch,
    };
  };