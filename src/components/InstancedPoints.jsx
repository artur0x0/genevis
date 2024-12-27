import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useVis } from '../context/VisContext';
import { useData } from '../context/DataContext';

const InstancedPoints = ({ data, onSelectPoint }) => {
    const meshRef = useRef();
    const heightScale = 200;
    const { camera, gl } = useThree();
    const { selectedColorColumn, colorScheme } = useVis();
    const { getModelData } = useData();

    useEffect(() => {
        if (!meshRef.current || !data.length) return;

        const tempObject = new THREE.Object3D();
        const colors = new Float32Array(data.length * 3);

        data.forEach((point, i) => {
            const height = point.expression * heightScale;
            tempObject.position.set(point.x, height/2, point.y);
            tempObject.scale.set(4, height || 0, 4);
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);

            // Get color using modelData lookup
            let color;
            const modelData = getModelData(point);
            if (modelData && colorScheme[selectedColorColumn]?.[modelData[selectedColorColumn]]) {
                const value = modelData[selectedColorColumn];
                const hslColor = colorScheme[selectedColorColumn][value];
                color = new THREE.Color(hslColor);
            } else {
                color = new THREE.Color(0.666, 0.666, 0.666); // Default gray
            }

            colors.set([color.r, color.g, color.b], i * 3);
        });

        meshRef.current.geometry.setAttribute('color', 
            new THREE.InstancedBufferAttribute(colors, 3));
        meshRef.current.instanceMatrix.needsUpdate = true;
        meshRef.current.geometry.attributes.color.needsUpdate = true;
    }, [data, selectedColorColumn, colorScheme, heightScale, getModelData]);

    const handleClick = (event) => {
        event.stopPropagation();
        
        const raycaster = new THREE.Raycaster();
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera({ x, y }, camera);
        const intersects = raycaster.intersectObject(meshRef.current);

        if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId;
            const point = data[instanceId];

            console.log("Clicked point: ", point);
            const modelData = getModelData(point);
            onSelectPoint({ ...point, modelData }); // Add modelData only when needed
        } else {
            onSelectPoint(null);
        }
    };

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, data.length]}
            onClick={handleClick}
            frustumCulled={false}
        >
            <boxGeometry attach="geometry" args={[1, 1, 1]}>
                <instancedBufferAttribute
                    attachObject={['attributes', 'color']}
                    args={[new Float32Array(data.length * 3), 3]}
                />
            </boxGeometry>
            <meshStandardMaterial
                attach="material"
                vertexColors
                metalness={0.1}
                roughness={0.3}
            />
        </instancedMesh>
    );
};

export default InstancedPoints;