import React, { useState, useEffect } from 'react';
import { parse } from 'papaparse';
import ThreePointVis from './components/ThreePointVis';

const App = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    console.log('Starting data fetch...');
    fetch('/depmap_data.csv')
      .then(response => response.text())
      .then(csvText => {
        parse(csvText, {
          complete: (results) => {
            const genes = results.data[0].slice(1);  // Get gene names from header
            const points = [];
            const rowSpacing = 2; // Space between cell lines
            const colSpacing = 2; // Space between genes

            // Process first 100 cell lines
            for (let rowIndex = 1; rowIndex < Math.min(results.data.length, 1500); rowIndex++) {
              const row = results.data[rowIndex];
              const cellLine = row[0];
              const rowPosition = (rowIndex - 1) * rowSpacing;

              // Create point for each gene value
              for (let colIndex = 1; colIndex < row.length; colIndex++) {
                const expressionValue = parseFloat(row[colIndex]);
                const colPosition = (colIndex - 1) * colSpacing;
                
                points.push({
                  x: colPosition - ((row.length - 1) * colSpacing) / 2, // Center the grid
                  y: rowPosition - 100, // Offset to center the visualization
                  z: 0,
                  cellLine,
                  gene: genes[colIndex - 1],
                  expression: expressionValue
                });
              }
            }
            
            console.log('Total points created:', points.length);
            console.log('Sample points:', points.slice(0, 5));
            setPoints(points);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
          }
        });
      })
      .catch(error => {
        console.error('Data loading error:', error);
      });
  }, []);

  return (
    <div className="w-screen h-screen p-4 bg-gray-900">
      <ThreePointVis
        data={points}
        layout={layout}
        selectedPoint={selectedPoint}
        onSelectPoint={setSelectedPoint}
      />
      
      {/* Debug panel */}
      <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm max-h-96 overflow-auto">
        <p className="font-medium">Dataset Info:</p>
        <p className="text-sm">Total Points: {points.length}</p>
        <p className="text-sm">Cell Lines: {new Set(points.map(p => p.cellLine)).size}</p>
        <p className="text-sm">Unique Genes: {new Set(points.map(p => p.gene)).size}</p>
        <div className="mt-4">
          <p className="font-medium">Sample Points:</p>
          <div className="text-sm mt-2 space-y-2">
            {points.slice(0, 3).map((point, index) => (
              <div key={index} className="border-b pb-2">
                <p>Cell Line: {point.cellLine}</p>
                <p>Gene: {point.gene}</p>
                <p>Expression: {point.expression.toFixed(3)}</p>
                <p>Position: ({point.x.toFixed(1)}, {point.y.toFixed(1)}, {point.z.toFixed(1)})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;