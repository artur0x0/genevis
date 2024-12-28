import React from 'react';
import { useData } from '../context/DataContext';
import { X } from 'lucide-react';

export const InfoPanel = ({ selectedPoint, onClose }) => {
  const { getModelData } = useData();
  
  if (!selectedPoint) return null;
  
  const modelData = getModelData(selectedPoint);
  
  return (
    <div className="fixed md:absolute bottom-4 left-1/2 md:left-4 -translate-x-1/2 md:translate-x-0 w-[calc(100%-2rem)] md:w-96 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm z-20">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">Selected Point</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close info panel"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        <p className="flex flex-wrap gap-x-2">
          <span>Cell Line:</span>
          <a
            href={`https://depmap.org/portal/cell_line/${selectedPoint.cellLine}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-light text-blue-600 hover:underline"
          >
            {selectedPoint.cellLine}
          </a>
        </p>
        
        <p className="flex flex-wrap gap-x-2">
          <span>Gene:</span>
          <a
            href={`https://depmap.org/portal/gene/${selectedPoint.gene.split(" ")[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-light text-blue-600 hover:underline"
          >
            {selectedPoint.gene}
          </a>
        </p>
        
        <p className="flex flex-wrap gap-x-2">
          <span>Expression:</span>
          <span className='font-light'>{selectedPoint.originalExpression.toFixed(3)}</span>
        </p>
        
        {modelData && (
          <>
            <div className="space-y-2">
              <p className="flex flex-wrap gap-x-2">
                <span>Lineage:</span>
                <span className='font-light'>{modelData.OncotreeLineage}</span>
              </p>
              <p className="flex flex-wrap gap-x-2">
                <span>Primary Disease:</span>
                <span className='font-light'>{modelData.OncotreePrimaryDisease}</span>
              </p>
              <p className="flex flex-wrap gap-x-2">
                <span>Model Type:</span>
                <span className='font-light'>{modelData.DepmapModelType}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;