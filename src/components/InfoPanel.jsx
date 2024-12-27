// InfoPanel.js
import React from 'react';
import { useData } from '../context/DataContext';
import { X } from 'lucide-react';

export const InfoPanel = ({ selectedPoint, onClose }) => {
    const { getModelData } = useData();

    if (!selectedPoint) return null;

    const modelData = getModelData(selectedPoint);
  
    return (
      <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium mb-2">Selected Point:</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close info panel"
          >
            <X size={16} />
          </button>
        </div>
        <p>
          Cell Line:{' '}
          <a
            href={`https://depmap.org/portal/cell_line/${selectedPoint.cellLine}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {selectedPoint.cellLine}
          </a>
        </p>
        <p>
          Gene:{' '}
          <a
            href={`https://depmap.org/portal/gene/${selectedPoint.gene.split(" ")[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {selectedPoint.gene}
          </a>
        </p>
        <p>Expression: {selectedPoint.originalExpression.toFixed(3)}</p>
        {modelData && (
        <>
          <h4 className="font-medium mt-2">Model Data:</h4>
          <p>Lineage: {modelData.OncotreeLineage}</p>
          <p>Primary Disease: {modelData.OncotreePrimaryDisease}</p>
          <p>Model Type: {modelData.DepmapModelType}</p>
        </>
      )}
      </div>
    );
  };

  export default InfoPanel;