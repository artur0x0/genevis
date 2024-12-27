import React from 'react';
import { useVis } from '../context/VisContext';
import ColorLegend from './ColorLegend';

const HeatmapControls = () => {
  const { 
    columns = [], // Provide default empty array
    selectedColorColumn,
    setSelectedColorColumn
  } = useVis();

  return (
    <div className="absolute top-4 left-4 w-64 z-10">
      <div className="bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm">
        <h3 className="font-medium mb-2">Color Coding</h3>
        <select
          value={selectedColorColumn}
          onChange={(e) => setSelectedColorColumn(e.target.value)}
          className="w-full p-2 border rounded bg-white"
          disabled={columns.length === 0}
        >
          {columns.length === 0 ? (
            <option>Loading...</option>
          ) : (
            columns.map(column => (
              <option key={column} value={column}>
                {column}
              </option>
            ))
          )}
        </select>
      </div>
      <ColorLegend />
    </div>
  );
};

export default HeatmapControls;