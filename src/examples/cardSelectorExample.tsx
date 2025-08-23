// Ejemplo de uso del CardSelector
import React, { useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { CardSelector } from '../components';
import type { DepartmentCardDetailed } from '../types/departments';

export const CardSelectorExample: React.FC = () => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isAutoSave, setIsAutoSave] = useState(true);

  // Ejemplo de departmentId - en un caso real vendría de props o context
  const exampleDepartmentId = "dept-123";

  const handleCardChange = (cardIds: string[], cards: DepartmentCardDetailed[]) => {
    console.log('Tarjetas seleccionadas:', { cardIds, cards });
    setSelectedCards(cardIds);
    
    if (!isAutoSave) {
      message.info(`Seleccionadas ${cardIds.length} tarjetas. Recuerda guardar los cambios.`);
    }
  };

  const handleSaveStart = () => {
    message.loading('Guardando cambios...', 0.5);
  };

  const handleSaveComplete = (success: boolean) => {
    if (success) {
      message.success('Cambios guardados correctamente');
    } else {
      message.error('Error al guardar cambios');
    }
  };

  const handleManualSave = () => {
    // En un caso real, aquí harías la llamada manual para guardar
    message.success('Guardado manual simulado');
  };

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <Card title="Ejemplo de CardSelector" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          
          {/* Selector con guardado automático */}
          <div>
            <h3>Selector con Guardado Automático</h3>
            <p>Las tarjetas se asignan/desasignan automáticamente al seleccionar/deseleccionar</p>
            <CardSelector
              departmentId={exampleDepartmentId}
              placeholder="Selecciona tarjetas para asignar al departamento..."
              autoSave={true}
              onSaveStart={handleSaveStart}
              onSaveComplete={handleSaveComplete}
              onChange={handleCardChange}
            />
          </div>

          {/* Selector controlado sin guardado automático */}
          <div>
            <h3>Selector Controlado (Sin Guardado Automático)</h3>
            <p>Las tarjetas se seleccionan pero no se guardan hasta hacer clic en "Guardar"</p>
            <CardSelector
              departmentId={exampleDepartmentId}
              value={selectedCards}
              placeholder="Selecciona tarjetas..."
              autoSave={false}
              onChange={handleCardChange}
            />
            <Button 
              type="primary" 
              onClick={handleManualSave}
              style={{ marginTop: 8 }}
              disabled={selectedCards.length === 0}
            >
              Guardar Cambios ({selectedCards.length} tarjetas)
            </Button>
          </div>

          {/* Selector deshabilitado */}
          <div>
            <h3>Selector Deshabilitado</h3>
            <CardSelector
              departmentId={exampleDepartmentId}
              placeholder="Selector deshabilitado..."
              disabled={true}
            />
          </div>

        </Space>
      </Card>

      {/* Información adicional */}
      <Card title="Información de Desarrollo" size="small">
        <Space direction="vertical">
          <p><strong>Principios SOLID aplicados:</strong></p>
          <ul>
            <li><strong>SRP:</strong> El componente tiene una sola responsabilidad: seleccionar tarjetas</li>
            <li><strong>OCP:</strong> Extensible mediante props sin modificar el código base</li>
            <li><strong>LSP:</strong> Cumple con el contrato de componentes de selección de Ant Design</li>
            <li><strong>ISP:</strong> Interface segregada con props opcionales específicas</li>
            <li><strong>DIP:</strong> Depende de abstracciones (hooks, services) no de implementaciones</li>
          </ul>
          
          <p><strong>Características:</strong></p>
          <ul>
            <li>Guardado automático o manual</li>
            <li>Modo controlado y no controlado</li>
            <li>Filtrado inteligente por título y tipo</li>
            <li>Visualización de permisos (editar/eliminar)</li>
            <li>Manejo de estados de carga y error</li>
            <li>Callbacks para eventos de guardado</li>
          </ul>
        </Space>
      </Card>
    </div>
  );
};

export default CardSelectorExample;
