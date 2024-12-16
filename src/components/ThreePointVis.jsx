import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const InstancedPoints = ({ data }) => {
  const meshRef = useRef();
  const heightScale = 100;

  useEffect(() => {
    if (!meshRef.current || !data.length) return;

    const tempObject = new THREE.Object3D();
    const matrix = new THREE.Matrix4();

    // Update all instances
    data.forEach((point, i) => {
      const height = point.expression * heightScale;
      
      // Position
      tempObject.position.set(point.x, height/2, point.y);
      // Scale (x, y, z) - y is height
      tempObject.scale.set(0.5, height || 0.1, 0.5);
      // Update matrix
      tempObject.updateMatrix();
      // Set instance matrix
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [data]);

  return (
    <instancedMesh 
      ref={meshRef}
      args={[null, null, data.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#aaa"
        metalness={0.1}
        roughness={0.3}
      />
    </instancedMesh>
  );
};

const ThreePointVis = ({ data }) => {
  return (
    <Canvas 
      camera={{ 
        position: [100, 100, 100],
        near: 0.1,
        far: 10000,
        fov: 75
      }}
      gl={{ 
        antialias: false, // Disable antialiasing for performance
        powerPreference: "high-performance"
      }}
    >
      <color attach="background" args={['#1f2937']} />
      <axesHelper args={[50]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 50, 50]} intensity={1} />
      
      <InstancedPoints data={data} />
      
      <gridHelper args={[500, 100, '#404040', '#202020']} />
      <OrbitControls />
    </Canvas>
  );
};

export default ThreePointVis;