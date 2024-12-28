import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { VisProvider } from '../context/VisContext';
import { Settings, X } from 'lucide-react';
import ThreePointVis from './ThreePointVis';
import HeatmapControls from './HeatmapControls';
import ViewControls from './ViewControls';
import FilterPane from './FilterPane';
import InfoPanel from './InfoPanel';
import SearchPane from './SearchPane';
import GestureTutorial from './GestureTutorial';

const MobileSettingsDrawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-medium">Configuration</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const GraphView = () => {
  const { points, loading, error } = useData();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [viewMode, setViewMode] = useState('free');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
      <div className="relative bg-gray-900 h-screen">
        {/* Mobile Layout */}
        <div className="md:hidden fixed top-20 left-4 right-4 z-20">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchPane />
            </div>
            <ViewControls 
              viewMode={viewMode} 
              setViewMode={setViewMode} 
            />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg shadow flex items-center justify-center"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Left Controls */}
          <div className="absolute top-4 left-4 w-64 flex flex-col gap-4 z-10">
            <HeatmapControls />
          </div>
          
          {/* Centered Search */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[600px] z-10">
            <SearchPane />
          </div>
          
          {/* Right Controls */}
          <div className="absolute right-4 top-8 bottom-4 w-64 flex flex-col gap-2 z-10">
            <ViewControls viewMode={viewMode} setViewMode={setViewMode} />
            <div className="flex-1 min-h-0">
              <FilterPane />
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="absolute inset-0">
          <ThreePointVis
            data={points}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedPoint={selectedPoint}
            onSelectPoint={setSelectedPoint}
          />
        </div>

        {/* Mobile Settings Drawer */}
        <MobileSettingsDrawer 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
        >
          <HeatmapControls />
          <FilterPane />
        </MobileSettingsDrawer>

        {/* Info Panel */}
        <InfoPanel
          selectedPoint={selectedPoint}
          onClose={() => setSelectedPoint(null)}
        />

        {/* Help Button & Tutorial */}
        <GestureTutorial />
      </div>
    </VisProvider>
  );
};

export default GraphView;