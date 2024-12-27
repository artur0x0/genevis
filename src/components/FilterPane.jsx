import React, { useState } from 'react';
import { useVis } from '../context/VisContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterPane = () => {
  const {
    uniqueValues,
    activeFilters,
    setActiveFilters
  } = useVis();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (column, value, checked) => {
    setActiveFilters(prev => {
      const currentValues = prev[column] || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      return {
        ...prev,
        [column]: newValues.length > 0 ? newValues : []
      };
    });
  };

  return (
    <div className={`transition-all duration-300 ease-in-out ${
      isExpanded ? 'h-full' : 'h-[48px]'  // 48px matches header height
    } bg-white/90 rounded-lg shadow backdrop-blur-sm overflow-hidden flex flex-col`}>
      <div 
        className="p-3 border-b flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium">Filters</h3>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="p-3 space-y-4 overflow-y-auto h-full">
          {Object.entries(uniqueValues).map(([column, values]) => (
            <div key={column} className="space-y-1">
              <h4 className="font-medium text-sm">{column}</h4>
              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                {values.map(value => (
                  <label key={value} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters[column]?.includes(value) || false}
                      onChange={(e) => handleFilterChange(column, value, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="truncate">{value || '(empty)'}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPane;