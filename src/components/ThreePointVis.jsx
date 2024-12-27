import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import InstancedPoints from './InstancedPoints';
import Axes from './Axes';
import { useVis } from '../context/VisContext';
import { useData } from '../context/DataContext';

const ThreePointVis = ({ data, viewMode, setViewMode, selectedPoint, onSelectPoint }) => {
  const controlsRef = useRef();
  const { activeFilters } = useVis();
  const { getModelData } = useData(); 

  // Filter the data based on active filters
  const filteredData = useMemo(() => {
    if (!data) return [];
    
    let filtered = data;

    // Apply gene filter if exists
    if (activeFilters.geneFilter) {
      const { index } = activeFilters.geneFilter;
      filtered = data.filter(point => point.columnIndex === index);
    }

    // Apply model data filters
    if (Object.keys(activeFilters).length > (activeFilters.geneFilter ? 1 : 0)) {
      filtered = filtered.filter(point => {
        return Object.entries(activeFilters).every(([column, selectedValues]) => {
          if (column === 'geneFilter') return true; // Skip gene filter as it's already handled
          if (!selectedValues?.length) return true;
          
          const modelData = getModelData(point);
          if (!modelData) return false;
          return selectedValues.includes(modelData[column]);
        });
      });
    }

    return filtered;
  }, [data, activeFilters]);
  
  useEffect(() => {
    if (!controlsRef.current) return;
    switch (viewMode) {
      case 'gene':
        controlsRef.current.object.position.set(0, 0, 5000);
        controlsRef.current.target.set(0, 0, 0);
        break;
      case 'cell':
        controlsRef.current.object.position.set(5000, 0, 0);
        controlsRef.current.target.set(0, 0, 0);
        break;
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [4000, 2000, 4000],
          near: 0.1,
          far: 10000,
          fov: 75
        }}
        gl={{
          antialias: false
        }}
      >
        <color attach="background" args={['#1f2937']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[50, 50, 50]} intensity={1} />
        <InstancedPoints
          data={filteredData}
          selectedPoint={selectedPoint}
          onSelectPoint={onSelectPoint}
        />
        <Axes />
        <OrbitControls
          ref={controlsRef}
          onChange={() => {
            if (viewMode !== 'free') setViewMode('free');
          }}
        />
      </Canvas>
    </div>
  );
};

export default ThreePointVis;