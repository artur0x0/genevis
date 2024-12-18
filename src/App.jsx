import React, { useState, useEffect } from 'react';
import { parse } from 'papaparse';
import ThreePointVis from './components/ThreePointVis';

const App = () => {
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [viewMode, setViewMode] = useState('free');

  useEffect(() => {
    console.log('Starting data fetch...');
    fetch('/depmap_data.csv')
      .then(response => response.text())
      .then(csvText => {
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
                  originalExpression: -expressionValue // Store negative value for display
                });
              }
            }
            
            setPoints(points);
          }
        });
      });
  }, []);

  return (
    <div className="w-screen h-screen p-4 bg-gray-900">
      {/* View Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <button
          onClick={() => setViewMode('gene')}
          className={`w-full px-4 py-2 rounded ${
            viewMode === 'gene' ? 'bg-blue-600' : 'bg-blue-500'
          } text-white hover:bg-blue-600 transition-colors`}
        >
          Gene View
        </button>
        <button
          onClick={() => setViewMode('cell')}
          className={`w-full px-4 py-2 rounded ${
            viewMode === 'cell' ? 'bg-blue-600' : 'bg-blue-500'
          } text-white hover:bg-blue-600 transition-colors`}
        >
          Cell Line View
        </button>
      </div>

      <ThreePointVis
        data={points}
        viewMode={viewMode}
        selectedPoint={selectedPoint}
        onSelectPoint={setSelectedPoint}
      />
      
      {/* Info Panel */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg shadow backdrop-blur-sm">
          <h3 className="font-medium mb-2">Selected Point:</h3>
          <p>Cell Line: {selectedPoint.cellLine}</p>
          <p>Gene: {selectedPoint.gene}</p>
          <p>Expression: {selectedPoint.originalExpression.toFixed(3)}</p>
        </div>
      )}
    </div>
  );
};

export default App;