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
      
      if (Object.keys(activeFilters).length === 0 || 
          Object.values(activeFilters).every(values => !values?.length)) {
        return data;
      }
  
      return data.filter(point => {
        const modelData = getModelData(point);
        if (!modelData) return false;
        
        return Object.entries(activeFilters).every(([column, selectedValues]) => {
          if (!selectedValues?.length) return true;
          return selectedValues.includes(modelData[column]);
        });
      });
    }, [data, activeFilters, getModelData]);

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