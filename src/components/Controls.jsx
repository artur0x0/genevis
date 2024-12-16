import React, { useRef } from 'react';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import * as THREE from 'three';

extend({ TrackballControls });

const ALT_KEY = 18;
const CTRL_KEY = 17;
const CMD_KEY = 91;

const Controls = React.forwardRef((props, ref) => {
  const controls = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    controls.current?.update();
  });

  React.useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (controls.current) {
        controls.current.target.set(0, 0, 0);
        camera.position.set(0, 0, 80);
        camera.up.set(
          controls.current.up0.x,
          controls.current.up0.y,
          controls.current.up0.z
        );
      }
    },
  }));

  return (
    <trackballControls
      ref={controls}
      args={[camera, gl.domElement]}
      dynamicDampingFactor={0.1}
      keys={[ALT_KEY, CTRL_KEY, CMD_KEY]}
      mouseButtons={{
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.ZOOM,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
    />
  );
});

Controls.displayName = 'Controls';
export default Controls;