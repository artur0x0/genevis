import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

const InstancedPoints = ({ data, onSelectPoint }) => {
    const meshRef = useRef();
    const heightScale = 200;
    const { camera, gl } = useThree();

    useEffect(() => {
        if (!meshRef.current || !data.length) return;

        const tempObject = new THREE.Object3D();
        const colors = new Float32Array(data.length * 3);

        data.forEach((point, i) => {
            const height = point.expression * heightScale;
            tempObject.position.set(point.x, height/2, point.y);
            tempObject.scale.set(4, height || 0, 4)
            tempObject.updateMatrix();
            meshRef.current.setMatrixAt(i, tempObject.matrix);
            colors.set([0.666, 0.666, 0.666], i * 3); // Set to grey #aaa
            meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3));
            meshRef.current.geometry.computeBoundingBox();
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        
    }, [data]);

    const handleClick = (event) => {
        event.stopPropagation();
    
        const raycaster = new THREE.Raycaster();
        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        console.log('Click event:', {
            normalizedCoords: { x, y },
            rawCoords: { clientX: event.clientX, clientY: event.clientY },
            rect: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            },
            camera: {
                position: camera.position.toArray(),
                rotation: camera.rotation.toArray(),
                matrix: camera.matrix.toArray(),
                projectionMatrix: camera.projectionMatrix.toArray()
            }
        });

        raycaster.setFromCamera({ x, y }, camera);
        const intersects = raycaster.intersectObject(meshRef.current);

        console.log('Raycaster test:', {
            ray: {
                origin: raycaster.ray.origin.toArray(),
                direction: raycaster.ray.direction.toArray()
            },
            intersectionsFound: intersects.length,
            intersectionDetails: intersects.map(int => ({
                distance: int.distance,
                instanceId: int.instanceId,
                point: int.point.toArray(),
                face: int.face
            }))
        });

        if (intersects.length > 0) {
            const instanceId = intersects[0].instanceId;
            onSelectPoint(data[instanceId]);

            // Update color to green for the selected instance
            const colors = meshRef.current.geometry.attributes.color.array;

            for (let i = 0; i < data.length; i++) {
                if (i === instanceId) {
                    colors.set([0, 1, 0], i * 3); // Green
                } else {
                    colors.set([0.666, 0.666, 0.666], i * 3); // Gray
                }
            }
            meshRef.current.geometry.attributes.color.needsUpdate = true;
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