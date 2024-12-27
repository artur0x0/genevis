import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { VisProvider } from '../context/VisContext';
import ThreePointVis from './ThreePointVis';
import HeatmapControls from './HeatmapControls';
import ViewControls from './ViewControls';
import FilterPane from './FilterPane';
import InfoPanel from './InfoPanel';
import InfoPopup from './InfoPopup';
import SearchPane from './SearchPane';

const GraphView = () => {
  const { points, loading, error } = useData();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [viewMode, setViewMode] = useState('free');
  const [showPopup, setShowPopup] = useState(false);

  const handleClearSelection = () => {
    setSelectedPoint(null);
  };

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
        {/* Left side controls */}
        <div className="absolute left-4 w-64 flex flex-col gap-4 z-10">
          <HeatmapControls />
        </div>
  
        {/* Centered search bar */}
        <SearchPane />
        
        {/* Right side controls */}
        <div className="absolute right-4 top-4 bottom-4 w-64 flex flex-col gap-2 z-10">
          <ViewControls viewMode={viewMode} setViewMode={setViewMode} />
          <div className="flex-1 min-h-0">
            <FilterPane />
          </div>
        </div>
  
        <ThreePointVis
          data={points}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedPoint={selectedPoint}
          onSelectPoint={setSelectedPoint}
        />
        
        <InfoPanel 
          selectedPoint={selectedPoint}
          onClose={handleClearSelection}
        />
        {showPopup && <InfoPopup onClose={() => setShowPopup(false)} />}
      </div>
    </VisProvider>
  );
};

export default GraphView;