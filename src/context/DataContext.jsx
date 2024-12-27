import React, { createContext, useContext, useState, useEffect } from 'react';
import { parse } from 'papaparse';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [modelData, setModelData] = useState(null);
  const [modelMap, setModelMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting data fetch...');
        
        const [depMapResponse, modelResponse] = await Promise.all([
          fetch('/depmap_data.csv'),
          fetch('/Model.csv')
        ]);

        const [depMapText, modelText] = await Promise.all([
          depMapResponse.text(),
          modelResponse.text()
        ]);

        // Parse model data first
        const modelResults = parse(modelText, { 
          header: true,
          skipEmptyLines: true,
        }).data;
        
        // Create lookup map using ModelID (ACH-*)
        const lookupMap = {};
        modelResults.forEach(row => {
          if (row && row.ModelID) {
            lookupMap[row.ModelID] = row;
          }
        });

        console.log('Model map created:', {
          totalModels: Object.keys(lookupMap).length,
          sampleModelIDs: Object.keys(lookupMap).slice(0, 5),
          sampleEntry: lookupMap[Object.keys(lookupMap)[0]]
        });

        setModelData(modelResults);
        setModelMap(lookupMap);

        // Parse and process depmap data
        parse(depMapText, {
          complete: (results) => {
            const genes = results.data[0]?.slice(1) || [];
            const points = [];
            const rowSpacing = 5;
            const colSpacing = 5;

            for (let rowIndex = 1; rowIndex < results.data.length; rowIndex++) {
              const row = results.data[rowIndex];
              if (!row || !row[0]) continue;
              
              const cellLine = row[0];  // This should be the ACH-* ID
              const rowPosition = (rowIndex - 1) * rowSpacing;

              for (let colIndex = 1; colIndex < row.length; colIndex++) {
                const expressionValue = parseFloat(row[colIndex]);
                if (isNaN(expressionValue)) continue;
                
                const colPosition = (colIndex - 1) * colSpacing;

                points.push({
                  x: colPosition - ((row.length - 1) * colSpacing) / 2,
                  y: rowPosition - ((results.data.length - 1) * rowSpacing) / 2,
                  z: 0,
                  cellLine,  // This is the ACH-* ID we'll use for lookup
                  gene: genes[colIndex - 1] || '',
                  expression: expressionValue,
                  originalExpression: -expressionValue
                });
              }
            }

            // Log some sample data to verify matching
            const samplePoint = points[0];
            console.log('Sample point lookup:', {
              point: samplePoint,
              matchingModelData: lookupMap[samplePoint.cellLine],
              hasMatch: !!lookupMap[samplePoint.cellLine]
            });

            setPoints(points);
            setLoading(false);
          },
          error: (error) => {
            setError(error.message);
            setLoading(false);
          }
        });
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get model data for a point
  const getModelData = (point) => {
    if (!point?.cellLine) return null;
    const modelData = modelMap[point.cellLine];
    if (!modelData) {
      console.log('No model data found for:', {
        cellLine: point.cellLine,
        availableModelIDs: Object.keys(modelMap).slice(0, 5)
      });
    }
    return modelData || null;
  };

  return (
    <DataContext.Provider value={{ 
      points, 
      modelData, 
      getModelData,
      loading, 
      error 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};