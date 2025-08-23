import React, { useCallback, useMemo } from 'react';
import { Select, Spin, Tag, message } from 'antd';
import { useCustomMutation } from '@refinedev/core';
import type { CardListItem } from '../../types/cards';
import type { DepartmentCardDetailed } from '../../types/departments';
import { useCardSelector } from '../../hooks/useCardSelector';

const { Option } = Select;

const UI_CONSTANTS = {
  SPACING: {
    SMALL: 8,
    MEDIUM: 16,
  },
  TAG_COLORS: {
    CAN_EDIT: 'blue',
    CAN_DELETE: 'red',
    DEFAULT: 'default',
  },
  MESSAGES: {
    NO_CARDS: 'No hay tarjetas disponibles',
    SAVING: 'Guardando cambios...',
    ASSIGNED_CARDS: 'Tarjetas asignadas:',
    SUCCESS_ASSIGN: 'Tarjeta asignada correctamente',
    SUCCESS_UNASSIGN: 'Tarjeta desasignada correctamente',
    ERROR_ASSIGN: 'Error al asignar tarjeta',
    ERROR_UNASSIGN: 'Error al desasignar tarjeta',
  },
  COLORS: {
    PRIMARY: '#1890ff',
    MUTED_TEXT: '#666',
  },
  FONT_SIZES: {
    SMALL: 12,
  },
};

interface CardSelectorProps {
  departmentId: string;
  value?: string[];
  onChange?: (cardIds: string[], cards: DepartmentCardDetailed[]) => void;
  disabled?: boolean;
  placeholder?: string;
  autoSave?: boolean;
  onSaveStart?: () => void;
  onSaveComplete?: (success: boolean) => void;
}

export const CardSelector: React.FC<CardSelectorProps> = ({
  departmentId,
  value,
  onChange,
  disabled = false,
  placeholder = "Selecciona tarjetas...",
  autoSave = true,
  onSaveStart,
  onSaveComplete,
}) => {
  const {
    availableCards,
    currentDepartmentCards,
    assignedCardIds,
    isLoading,
    refetch,
  } = useCardSelector(departmentId);

  // Mutation para asignar tarjeta
  const assignCardMutation = useCustomMutation();

  // Mutation para desasignar tarjeta
  const unassignCardMutation = useCustomMutation();

  // Determinar IDs seleccionados: controlado vs no controlado
  const selectedCardIds = useMemo(() => {
    return value ?? assignedCardIds;
  }, [value, assignedCardIds]);

  // Normalizar tarjetas seleccionadas para el callback
  const normalizeCards = useCallback((selectedIds: string[]): DepartmentCardDetailed[] => {
    return selectedIds.map(id => {
      const card = availableCards.find(c => c.id === id);
      const currentAssignment = currentDepartmentCards.find(dc => dc.id === id);
      
      return {
        id: currentAssignment?.id || '',
        title: card?.title || 'Tarjeta desconocida',
        description: card?.description || undefined,
        imageUrl: card?.imageUrl || undefined,
        linkUrl: card?.linkUrl || undefined,
        type: card?.type || '',
        isActive: card?.isActive ?? true,
        sortOrder: card?.sortOrder || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        canEdit: currentAssignment?.canEdit ?? true,
        canDelete: currentAssignment?.canDelete ?? false,
        assignedAt: currentAssignment?.assignedAt || new Date().toISOString(),
        assignedBy: '', // Se asignará desde el backend
        createdBy: {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
        },
      };
    });
  }, [availableCards, currentDepartmentCards]);

  // Manejar asignación de tarjeta
  const handleAssignCard = useCallback(async (cardId: string) => {
    try {
      await assignCardMutation.mutateAsync({
        url: `/departments/${departmentId}/cards/${cardId}`,
        method: 'post',
        values: {
          canEdit: true,
          canDelete: false,
          message: 'Tarjeta asignada al departamento',
        },
      });
      
      message.success(UI_CONSTANTS.MESSAGES.SUCCESS_ASSIGN);
      refetch();
      return true;
    } catch (error) {
      console.error('Error asignando tarjeta:', error);
      message.error(UI_CONSTANTS.MESSAGES.ERROR_ASSIGN);
      return false;
    }
  }, [departmentId, assignCardMutation, refetch]);

  // Manejar desasignación de tarjeta
  const handleUnassignCard = useCallback(async (cardId: string) => {
    try {
      await unassignCardMutation.mutateAsync({
        url: `/departments/${departmentId}/cards/${cardId}`,
        method: 'delete',
        values: {},
      });
      
      message.success(UI_CONSTANTS.MESSAGES.SUCCESS_UNASSIGN);
      refetch();
      return true;
    } catch (error) {
      console.error('Error desasignando tarjeta:', error);
      message.error(UI_CONSTANTS.MESSAGES.ERROR_UNASSIGN);
      return false;
    }
  }, [departmentId, unassignCardMutation, refetch]);

  // Manejar guardado automático
  const handleAutoSave = useCallback(async (selectedIds: string[]) => {
    if (!autoSave) return;

    onSaveStart?.();

    const currentIds = assignedCardIds;
    const toAssign = selectedIds.filter(id => !currentIds.includes(id));
    const toUnassign = currentIds.filter(id => !selectedIds.includes(id));

    try {
      // Procesar asignaciones
      for (const cardId of toAssign) {
        const success = await handleAssignCard(cardId);
        if (!success) {
          onSaveComplete?.(false);
          return;
        }
      }

      // Procesar desasignaciones
      for (const cardId of toUnassign) {
        const success = await handleUnassignCard(cardId);
        if (!success) {
          onSaveComplete?.(false);
          return;
        }
      }

      const normalizedCards = normalizeCards(selectedIds);
      onChange?.(selectedIds, normalizedCards);
      onSaveComplete?.(true);
    } catch (error) {
      console.error('Error en guardado automático:', error);
      onSaveComplete?.(false);
    }
  }, [autoSave, assignedCardIds, handleAssignCard, handleUnassignCard, normalizeCards, onChange, onSaveStart, onSaveComplete]);

  // Manejar cambios en la selección
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    if (autoSave) {
      handleAutoSave(selectedIds);
    } else {
      const normalizedCards = normalizeCards(selectedIds);
      onChange?.(selectedIds, normalizedCards);
    }
  }, [autoSave, handleAutoSave, normalizeCards, onChange]);

  // Función optimizada para filtrar opciones
  const filterOption = useCallback((input: string, option: any) => {
    const searchText = input.toLowerCase();
    const title = option?.children?.props?.children?.[0]?.props?.children || '';
    const type = option?.value ? availableCards.find(c => c.id === option.value)?.type || '' : '';
    
    return title.toLowerCase().includes(searchText) || 
           type.toLowerCase().includes(searchText);
  }, [availableCards]);

  const isUpdating = assignCardMutation.isLoading || unassignCardMutation.isLoading;

  return (
    <div>
      <Select
        mode="multiple"
        value={selectedCardIds}
        onChange={handleSelectionChange}
        placeholder={placeholder}
        disabled={disabled || isLoading || isUpdating}
        loading={isLoading}
        style={{ width: '100%' }}
        notFoundContent={isLoading ? <Spin size="small" /> : UI_CONSTANTS.MESSAGES.NO_CARDS}
        filterOption={filterOption}
      >
        {availableCards.map(card => (
          <Option key={card.id} value={card.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{card.title}</span>&nbsp;
              <Tag color={UI_CONSTANTS.TAG_COLORS.DEFAULT} style={{ fontSize: UI_CONSTANTS.FONT_SIZES.SMALL }}>
                {card.type}
              </Tag>
            </div>
          </Option>
        ))}
      </Select>
      
      {isUpdating && (
        <div style={{ marginTop: UI_CONSTANTS.SPACING.SMALL, color: UI_CONSTANTS.COLORS.PRIMARY }}>
          <Spin size="small" /> {UI_CONSTANTS.MESSAGES.SAVING}
        </div>
      )}
    </div>
  );
};

export default CardSelector;
