// hooks/useCardSelector.ts
import { useList, useCustom } from '@refinedev/core';
import { CardListItem } from '../types/cards';
import { DepartmentCardDetailed } from '../types/departments';
import { useMemo } from 'react';
import { DATA_PROVIDER_CONFIG } from "../dataProvider/config";
import { dataProvider } from '../dataProvider';

export const useCardSelector = (departmentId: string) => {
  // Obtener todas las tarjetas disponibles
  const availableCardsQuery = useList<CardListItem>({
    resource: DATA_PROVIDER_CONFIG.SUPPORTED_RESOURCES.CARDS,
  });

  // Obtener tarjetas asignadas al departamento
  const departmentCardsQuery = useCustom<DepartmentCardDetailed[]>({
    url: `/departments/${departmentId}/cards`,
    method: 'get',
    queryOptions: { enabled: Boolean(departmentId) },
  });

  // Memoizar valores derivados
  const availableCards = useMemo(
    () => availableCardsQuery.data?.data || [],
    [availableCardsQuery.data]
  );

  const currentDepartmentCards = useMemo(
    () => departmentCardsQuery.data?.data || [],
    [departmentCardsQuery.data]
  );

  // Obtener IDs de tarjetas ya asignadas para facilitar el manejo
  const assignedCardIds = useMemo(
    () => currentDepartmentCards.map(dc => dc.id),
    [currentDepartmentCards]
  );

  return {
    availableCards,
    currentDepartmentCards,
    assignedCardIds,
    isLoading: availableCardsQuery.isLoading || departmentCardsQuery.isLoading,
    refetch: departmentCardsQuery.refetch,
    error: availableCardsQuery.error || departmentCardsQuery.error,
  };
};
