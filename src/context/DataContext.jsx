// DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { parse } from 'papaparse';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting data fetch...');
        const response = await fetch('/depmap_data.csv');
        const csvText = await response.text();
        
        parse(csvText, {
          complete: (results) => {
            const genes = results.data[0].slice(1);
            const points = [];
            const rowSpacing = 5;
            const colSpacing = 5;
            
            for (let rowIndex = 1; rowIndex < results.data.length; rowIndex++) {
              const row = results.data[rowIndex];
              const cellLine = row[0];
              const rowPosition = (rowIndex - 1) * rowSpacing;
              
              for (let colIndex = 1; colIndex < row.length; colIndex++) {
                const expressionValue = parseFloat(row[colIndex]);
                const colPosition = (colIndex - 1) * colSpacing;
                
                points.push({
                  x: colPosition - ((row.length - 1) * colSpacing) / 2,
                  y: rowPosition - ((results.data.length - 1) * rowSpacing) / 2,
                  z: 0,
                  cellLine,
                  gene: genes[colIndex - 1],
                  expression: expressionValue,
                  originalExpression: -expressionValue
                });
              }
            }
            
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

  return (
    <DataContext.Provider value={{ points, loading, error }}>
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