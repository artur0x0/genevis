import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAnimatedLayout } from '../layouts';
import { a } from '@react-spring/three';

const scratchObject3D = new THREE.Object3D();
const scratchColor = new THREE.Color();

const SELECTED_COLOR = '#6f6';
const DEFAULT_COLOR = '#888';

function updateInstancedMeshMatrices({ mesh, data }) {
  if (!mesh) return;

  for (let i = 0; i < data.length; ++i) {
    const { x, y, z } = data[i];
    scratchObject3D.position.set(x, y, z);
    scratchObject3D.rotation.set(0.5 * Math.PI, 0, 0);
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

const usePointColors = ({ data, selectedPoint }) => {
  const numPoints = data.length;
  const colorAttrib = useRef();
  const colorArray = React.useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

  useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      scratchColor.set(data[i] === selectedPoint ? SELECTED_COLOR : DEFAULT_COLOR);
      scratchColor.toArray(colorArray, i * 3);
    }
    if (colorAttrib.current) {
      colorAttrib.current.needsUpdate = true;
    }
  }, [data, selectedPoint, colorArray]);

  return { colorAttrib, colorArray };
};

const useMousePointInteraction = ({ data, selectedPoint, onSelectPoint }) => {
  const mouseDownRef = useRef([0, 0]);

  const handlePointerDown = (e) => {
    mouseDownRef.current = [e.clientX, e.clientY];
  };

  const handleClick = (event) => {
    const { instanceId, clientX, clientY } = event;
    const downDistance = Math.sqrt(
      Math.pow(mouseDownRef.current[0] - clientX, 2) +
      Math.pow(mouseDownRef.current[1] - clientY, 2)
    );

    if (downDistance > 5) {
      event.stopPropagation();
      return;
    }

    if (instanceId === undefined) return;
    const point = data[instanceId];

    if (point === selectedPoint) {
      onSelectPoint(null);
    } else {
      onSelectPoint(point);
    }
  };

  return { handlePointerDown, handleClick };
};

const InstancedPoints = ({ data, layout, selectedPoint, onSelectPoint }) => {
  const meshRef = useRef();
  const numPoints = data.length;

  const { animationProgress } = useAnimatedLayout({
    data,
    layout,
    onFrame: () => {
      updateInstancedMeshMatrices({ mesh: meshRef.current, data });
    },
  });

  useEffect(() => {
    updateInstancedMeshMatrices({ mesh: meshRef.current, data });
  }, [data, layout]);

  const { handleClick, handlePointerDown } = useMousePointInteraction({
    data,
    selectedPoint,
    onSelectPoint,
  });

  const { colorAttrib, colorArray } = usePointColors({ data, selectedPoint });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[null, null, numPoints]}
        frustumCulled={false}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]}>
          <instancedBufferAttribute
            ref={colorAttrib}
            attachObject={['attributes', 'color']}
            args={[colorArray, 3]}
          />
        </cylinderGeometry>
        <meshStandardMaterial vertexColors={true} />
      </instancedMesh>
      {selectedPoint && (
        <a.group
          position={animationProgress.interpolate(() => [
            selectedPoint.x,
            selectedPoint.y,
            selectedPoint.z,
          ])}
        >
          <pointLight
            distance={9}
            position={[0, 0, 0.3]}
            intensity={2.2}
            decay={30}
            color="#3f3"
          />
          <pointLight
            position={[0, 0, 0]}
            decay={1}
            distance={5}
            intensity={1.5}
            color="#2f0"
          />
        </a.group>
      )}
    </>
  );
};

export default InstancedPoints;