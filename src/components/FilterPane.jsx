import React from 'react';
import { useVis } from '../context/VisContext';
import { useData } from '../context/DataContext';

const FilterPane = () => {
  const {
    uniqueValues,
    activeFilters,
    setActiveFilters
  } = useVis();
  const { modelData } = useData(); // We can use modelData directly here as it contains all possible values

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
    <div className="absolute right-4 top-24 bottom-4 w-64 bg-white/90 rounded-lg shadow backdrop-blur-sm overflow-hidden flex flex-col z-10">
      <div className="p-4 border-b">
        <h3 className="font-medium">Filters</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(uniqueValues).map(([column, values]) => (
          <div key={column} className="space-y-2">
            <h4 className="font-medium text-sm">{column}</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {values.map(value => (
                <label key={value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={activeFilters[column]?.includes(value) || false}
                    onChange={(e) => handleFilterChange(column, value, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{value || '(empty)'}</span>
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