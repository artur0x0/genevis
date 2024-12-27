import React from 'react';
import { useVis } from '../context/VisContext';

const FilterPane = () => {
  const {
    uniqueValues,
    activeFilters,
    setActiveFilters
  } = useVis();

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
    <div className="h-full bg-white/90 rounded-lg shadow backdrop-blur-sm overflow-hidden flex flex-col max-h-full">
      <div className="p-3 border-b">
        <h3 className="font-medium">Filters</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
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
  );
};

export default FilterPane;