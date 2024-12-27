import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { VisProvider } from '../context/VisContext';
import ThreePointVis from './ThreePointVis';
import HeatmapControls from './HeatmapControls';
import FilterPane from './FilterPane';
import InfoPanel from './InfoPanel';
import InfoPopup from './InfoPopup';

const GraphView = () => {
  const { points, loading, error } = useData();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [viewMode, setViewMode] = useState('free');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hidePopup = document.cookie.split(';').some(item => item.trim().startsWith('hideDataPopup='));
    if (!hidePopup) {
      setShowPopup(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <VisProvider>
      <div className="relative bg-gray-900 flex-1">
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

        <HeatmapControls />
        <FilterPane />

        <ThreePointVis
          data={points}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
        />
        
        <InfoPanel selectedPoint={selectedPoint} />
        {showPopup && <InfoPopup onClose={() => setShowPopup(false)} />}
      </div>
    </VisProvider>
  );
};

export default GraphView;