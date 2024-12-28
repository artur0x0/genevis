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
    
    if (activeFilters.geneFilter) {
      const { index } = activeFilters.geneFilter;
      filtered = data.filter(point => point.columnIndex === index);
    }
    
    if (Object.keys(activeFilters).length > (activeFilters.geneFilter ? 1 : 0)) {
      filtered = filtered.filter(point => {
        return Object.entries(activeFilters).every(([column, selectedValues]) => {
          if (column === 'geneFilter') return true;
          if (!selectedValues?.length) return true;
          const modelData = getModelData(point);
          if (!modelData) return false;
          return selectedValues.includes(modelData[column]);
        });
      });
    }
    return filtered;
  }, [data, activeFilters, getModelData]);

  // Calculate bounds of all points
  const bounds = useMemo(() => {
    if (!filteredData?.length) return null;
    
    const bounds = {
      minX: Infinity, maxX: -Infinity,
      minY: Infinity, maxY: -Infinity,
      minZ: Infinity, maxZ: -Infinity
    };
    
    filteredData.forEach(point => {
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
      bounds.minZ = Math.min(bounds.minZ, point.z);
      bounds.maxZ = Math.max(bounds.maxZ, point.z);
    });
    
    return bounds;
  }, [filteredData]);

  // Calculate initial camera position based on viewport
  const initialCameraPosition = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const baseDistance = isMobile ? 8000 : 4000;
    const scale = isMobile ? 0.6 : 1;
    
    return [
      baseDistance * scale,
      baseDistance * 0.5 * scale,
      baseDistance * scale
    ];
  }, []);

  useEffect(() => {
    if (!controlsRef.current || !bounds) return;
    
    const fitToView = () => {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 1.4 : 1.1; // More padding on mobile, tighter on desktop
      
      switch (viewMode) {
        case 'gene': {
          // Calculate distance needed to fit width in view
          const width = bounds.maxX - bounds.minX;
          const height = bounds.maxY - bounds.minY;
          const distance = Math.max(width, height) * padding;
          
          // Adjust distance based on viewport
          const adjustedDistance = isMobile ? distance : distance * 0.8;
          
          controlsRef.current.object.position.set(0, 0, adjustedDistance);
          controlsRef.current.target.set(
            (bounds.maxX + bounds.minX) / 2,
            (bounds.maxY + bounds.minY) / 2,
            0
          );
          break;
        }
        case 'cell': {
          const depth = bounds.maxZ - bounds.minZ;
          const height = bounds.maxY - bounds.minY;
          const distance = Math.max(depth, height) * padding;
          
          // Adjust distance based on viewport
          const adjustedDistance = isMobile ? distance : distance * 0.8;
          
          controlsRef.current.object.position.set(adjustedDistance, 0, 0);
          controlsRef.current.target.set(
            0,
            (bounds.maxY + bounds.minY) / 2,
            (bounds.maxZ + bounds.minZ) / 2
          );
          break;
        }
      }
    };
  
    fitToView();
    
    // Also fit on resize
    window.addEventListener('resize', fitToView);
    return () => window.removeEventListener('resize', fitToView);
  }, [viewMode, bounds]);

  return (
    <Canvas
      className="touch-none"
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{
        position: initialCameraPosition,
        near: 0.1,
        far: 10000,
        fov: window.innerWidth < 768 ? 85 : 75
      }}
      gl={{
        antialias: false,
        powerPreference: "high-performance"
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
  );
};

export default ThreePointVis;