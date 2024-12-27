import React, { createContext, useContext, useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const VisContext = createContext();

export const VisProvider = ({ children }) => {
  const { modelData } = useData();
  const [selectedColorColumn, setSelectedColorColumn] = useState('OncotreeLineage');
  const [activeFilters, setActiveFilters] = useState({});
  const [colorScheme, setColorScheme] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!modelData?.length) {
      console.log('No model data available yet');
      return;
    }

    console.log('Processing model data:', {
      length: modelData.length,
      sampleRow: modelData[0]
    });

    // Get and set columns first
    const validColumns = Object.keys(modelData[0]).filter(key => key);
    setColumns(validColumns);

    const newUniqueValues = {};
    const newColorScheme = {};

    validColumns.forEach(column => {
      const values = Array.from(new Set(
        modelData.map(row => row[column]).filter(Boolean)
      )).sort();
      
      newUniqueValues[column] = values;

      const colors = {};
      values.forEach((value, index) => {
        const hue = (index / (values.length - 1)) * 360;
        colors[value] = `hsl(${hue}, 70%, 50%)`;
      });
      newColorScheme[column] = colors;
    });

    console.log('Generated visualization data:', {
      columnsCount: validColumns.length,
      uniqueValuesKeys: Object.keys(newUniqueValues),
      colorSchemeKeys: Object.keys(newColorScheme)
    });

    setUniqueValues(newUniqueValues);
    setColorScheme(newColorScheme);
  }, [modelData]);

  const value = {
    selectedColorColumn,
    setSelectedColorColumn,
    activeFilters,
    setActiveFilters,
    colorScheme,
    uniqueValues,
    columns, // Make sure columns is included in the context value
  };

  return (
    <VisContext.Provider value={value}>
      {children}
    </VisContext.Provider>
  );
};

export const useVis = () => {
  const context = useContext(VisContext);
  if (!context) {
    throw new Error('useVis must be used within a VisProvider');
  }
  return context;
};