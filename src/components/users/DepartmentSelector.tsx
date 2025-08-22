import React, { useCallback, useMemo } from 'react';
import { Select, Spin, Tag } from 'antd';
import type { MyDepartment } from '../../types/departments';
import { useDepartmentSelector } from '../../hooks/useDepartmentSelector';

const { Option } = Select;

const UI_CONSTANTS = {
  SPACING: {
    SMALL: 8,
    MEDIUM: 16,
  },
  TAG_COLORS: {
    HEAD: 'blue',
    MEMBER: 'default',
  },
  MESSAGES: {
    HEAD_SUFFIX: ' (Jefe)',
    NO_DEPARTMENTS: 'No hay departamentos disponibles',
    SAVING: 'Guardando cambios...',
    ASSIGNED_DEPARTMENTS: 'Departamentos asignados:',
  },
  COLORS: {
    PRIMARY: '#1890ff',
    MUTED_TEXT: '#666',
  },
  FONT_SIZES: {
    SMALL: 12,
  },
};

interface DepartmentSelectorProps {
  userId: string;
  value?: string[];
  onChange?: (departmentIds: string[], departments: MyDepartment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  autoSave?: boolean;
  onSaveStart?: () => void;
  onSaveComplete?: (success: boolean) => void;
}

export const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  userId,
  value,
  onChange,
  disabled = false,
  placeholder = "Selecciona departamentos...",
  autoSave = true,
  onSaveStart,
  onSaveComplete,
}) => {
  const {
    availableDepartments,
    currentUserDepartments,
    isLoading,
    updateDepartments,
    isUpdating,
    refetch,
  } = useDepartmentSelector(userId);

  // Determinar IDs seleccionados: controlado vs no controlado
  const selectedDepartmentIds = useMemo(() => {
    return value ?? currentUserDepartments.map(ud => ud.department.id);
  }, [value, currentUserDepartments]);

  // Normalizar departamentos seleccionados para el callback
  const normalizeDepartments = useCallback((selectedIds: string[]): MyDepartment[] => {
    return selectedIds.map(id => {
      const dept = availableDepartments.find(d => d.id === id);
      const currentAssignment = currentUserDepartments.find(ud => ud.department.id === id);
      
      return {
        assignment: {
          id: currentAssignment?.assignment.id || '',
          isHead: currentAssignment?.assignment.isHead || false,
          joinedAt: currentAssignment?.assignment.joinedAt || new Date().toISOString()
        },
        department: {
          id: dept?.id || id,
          name: dept?.name || 'Departamento desconocido',
          slug: dept?.slug || '',
          description: dept?.description,
          isActive: dept?.isActive ?? true
        }
      };
    });
  }, [availableDepartments, currentUserDepartments]);

  // Manejar guardado automático
  const handleAutoSave = useCallback((selectedIds: string[]) => {
    if (!autoSave) return;

    onSaveStart?.();

    updateDepartments(
      {
        id: userId,
        values: {
          departmentIds: selectedIds,
          currentDepartments: currentUserDepartments,
        },
      },
      {
        onSuccess: () => {
          refetch();
          const normalizedDepartments = normalizeDepartments(selectedIds);
          onChange?.(selectedIds, normalizedDepartments);
          onSaveComplete?.(true);
        },
        onError: (error) => {
          console.error('Error guardando departamentos:', error);
          onSaveComplete?.(false);
        }
      }
    );
  }, [autoSave, userId, currentUserDepartments, updateDepartments, refetch, normalizeDepartments, onChange, onSaveStart, onSaveComplete]);

  // Manejar cambios en la selección
  const handleSelectionChange = useCallback((selectedIds: string[]) => {
    if (autoSave) {
      handleAutoSave(selectedIds);
    } else {
      const normalizedDepartments = normalizeDepartments(selectedIds);
      onChange?.(selectedIds, normalizedDepartments);
    }
  }, [autoSave, handleAutoSave, normalizeDepartments, onChange]);

  // Función optimizada para filtrar opciones
  const filterOption = useCallback((input: string, option: any) => {
    return option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false;
  }, []);

  return (
    <div>
      <Select
        mode="multiple"
        value={selectedDepartmentIds}
        onChange={handleSelectionChange}
        placeholder={placeholder}
        disabled={disabled || isLoading || isUpdating}
        loading={isLoading}
        style={{ width: '100%' }}
        notFoundContent={isLoading ? <Spin size="small" /> : UI_CONSTANTS.MESSAGES.NO_DEPARTMENTS}
        filterOption={filterOption}
      >
        {availableDepartments.map(dept => (
          <Option key={dept.id} value={dept.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{dept.name}</span>
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

export default DepartmentSelector;
