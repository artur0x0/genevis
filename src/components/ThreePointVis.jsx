import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import InstancedPoints from './InstancedPoints';
import Axes from './Axes';

const ThreePointVis = ({ data, viewMode, selectedPoint, onSelectPoint }) => {
    const controlsRef = useRef();

    useEffect(() => {
        if (!controlsRef.current) return;
        
        switch (viewMode) {
            case 'gene':
                controlsRef.current.object.position.set(0, 0, 1500);
                controlsRef.current.target.set(0, 0, 0);
                break;
            case 'cell':
                controlsRef.current.object.position.set(1500, 0, 0);
                controlsRef.current.target.set(0, 0, 0);
                break;
        }
    }, [viewMode]);

    return (
        <Canvas
            camera={{
                position: [1500, 1500, 1500],
                near: 0.1,
                far: 10000,
                fov: 75
            }}
            gl={{
                antialias: false,
 
            }}
        >
            <color attach="background" args={['#1f2937']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[50, 50, 50]} intensity={1} />
            
            <InstancedPoints
                data={data}
                selectedPoint={selectedPoint}
                onSelectPoint={onSelectPoint}
            />
            <Axes />
            
            <OrbitControls ref={controlsRef} />
        </Canvas>
    );
};

export default ThreePointVis;