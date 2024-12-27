// InfoPanel.js
import React from 'react';
import { useData } from '../context/DataContext';

export const InfoPanel = ({ selectedPoint }) => {
    const { getModelData } = useData();

    if (!selectedPoint) return null;

    const modelData = getModelData(selectedPoint);
  
    return (
      <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm">
        <h3 className="font-medium mb-2">Selected Point:</h3>
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