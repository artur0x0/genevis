import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import InstancedPoints from './InstancedPoints';
import Axes from './Axes';

const ThreePointVis = ({ data, viewMode, setViewMode, selectedPoint, onSelectPoint }) => {
    const controlsRef = useRef();

    // Handle controls change
    const handleControlsChange = () => {
        // Only reset to 'free' if we're currently in a preset view mode
        if (viewMode === 'gene' || viewMode === 'cell') {
            setViewMode('free');
        }
    };

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
                data={data}
                onSelectPoint={onSelectPoint}
            />
            <Axes />
            
            <OrbitControls 
                ref={controlsRef} 
                onChange={handleControlsChange}
            />
        </Canvas>
    );
};

export default ThreePointVis;