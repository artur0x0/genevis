import React, { useState } from 'react';
import { useVis } from '../context/VisContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ColorLegend = () => {
  const { selectedColorColumn, colorScheme, uniqueValues } = useVis();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!uniqueValues[selectedColorColumn]) return null;

  return (
    <div className="mt-2 bg-white/90 rounded-lg shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between font-light text-medium hover:bg-gray-50 rounded-lg"
      >
        Color Legend
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isExpanded && (
        <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
          {uniqueValues[selectedColorColumn].map(value => (
            <div key={value} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colorScheme[selectedColorColumn][value] }}
              />
              <span className="text-sm">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorLegend;