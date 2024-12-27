import React from 'react';
import { useVis } from '../context/VisContext';

const HeatmapControls = () => {
  const { 
    uniqueValues,
    selectedColorColumn,
    setSelectedColorColumn
  } = useVis();

  return (
    <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm z-10">
      <h3 className="font-medium mb-2">Color Coding</h3>
      <select
        value={selectedColorColumn}
        onChange={(e) => setSelectedColorColumn(e.target.value)}
        className="w-full p-2 border rounded bg-white"
      >
        {Object.keys(uniqueValues).map(column => (
          <option key={column} value={column}>
            {column}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HeatmapControls;