'use client';

import { Text } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const maxAzimuthAngle = Math.PI / 12;

const hspace = 8;
const vspace = 3;
const speed = 0.5;
const textScale = 1.5;

const WettText = ({ position, row, col }: { position: [number, number, number]; row: number; col: number }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const initialX = position[0];
  const initialY = position[1];
  const horizontalDirection = row % 2 === 0 ? 1 : -1; // 1 for even rows (left), -1 for odd rows (right)
  const verticalDirection = col % 2 === 0 ? 1 : -1; // 1 for even columns (up), -1 for odd columns (down)

  useFrame((state) => {
    if (textRef.current) {
      // Create combined horizontal and vertical oscillation
      textRef.current.position.x = initialX + Math.sin(state.clock.elapsedTime * speed) * hspace * horizontalDirection;
      textRef.current.position.y =
        initialY + ((Math.sin(state.clock.elapsedTime * speed) * vspace) / 4) * verticalDirection;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontWeight='bold'
      scale={[textScale, textScale, textScale]}
      color='black'
      anchorX='center'
      anchorY='middle'
    >
      wett.dev
    </Text>
  );
};

const GridText = ({ rows, cols }: { rows: number; cols: number }) => {
  const texts = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (col - (cols - 1) / 2) * hspace;
      const y = (row - (rows - 1) / 2) * vspace;
      texts.push(<WettText key={`${row}-${col}`} position={[x, y, 0]} row={row} col={col} />);
    }
  }
  return <>{texts}</>;
};

const MouseOrbitEffect = () => {
  const { camera } = useThree();
  const orbitRef = useRef<THREE.Object3D>(null);

  // For debugging
  const debugRef = useRef({
    lastY: 0,
  });

  // Setup the orbit object once
  useEffect(() => {
    if (orbitRef.current) {
      // Important to maintain proper rotation order
      orbitRef.current.rotation.order = 'YXZ';

      // Add camera to the orbit object
      orbitRef.current.position.set(0, 0, 0);
      orbitRef.current.add(camera);

      // Set camera position relative to orbit
      camera.position.set(0, 0, 10);
    }
  }, [camera]);

  // Update rotation based on mouse position
  useFrame((state) => {
    if (orbitRef.current) {
      // Get normalized mouse position (-1 to 1)
      const x = state.pointer.x;
      const y = state.pointer.y;

      // Debug to console if the y value is changing
      if (Math.abs(y - debugRef.current.lastY) > 0.01) {
        console.log('Mouse Y position:', y);
        debugRef.current.lastY = y;
      }

      // More direct rotation approach
      // Horizontal rotation (left/right)
      const targetRotationY = x * maxAzimuthAngle;

      // Vertical rotation (up/down) - try a simpler approach
      // Scale the y input directly - the negative is because "up" is negative in three.js rotation
      const targetRotationX = -y * 0.3;

      // Apply rotation with slight easing for smoothness
      orbitRef.current.rotation.y += (targetRotationY - orbitRef.current.rotation.y) * 0.1;
      orbitRef.current.rotation.x += (targetRotationX - orbitRef.current.rotation.x) * 0.1;

      // Keep the camera level
      orbitRef.current.rotation.z = 0;
    }
  });

  return <primitive object={new THREE.Object3D()} ref={orbitRef} />;
};

const TextWall = () => {
  return (
    <div className='absolute inset-0'>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        {/* <ambientLight intensity={0.1} /> */}
        {/* <directionalLight color="blue" position={[0, 5, 5]} /> */}
        <GridText rows={20} cols={10} />
        <MouseOrbitEffect />
      </Canvas>
    </div>
  );
};

const Card = ({ href, text }: { href: string; text: string }) => (
  <div className='w-fit rounded-xl border-2 border-black bg-white p-4'>
    <Link href={href} className='font-bold text-black text-xl hover:text-blue-700'>
      {text}
    </Link>
  </div>
);

export default function HomePage() {
  return (
    <>
      <div className='relative z-10 flex flex-row gap-4 p-10'>
        <Card href='/high-scores' text='high scores' />
        <Card href='/orca' text='orca' />
        <Card href='/fitgirl-says' text='fitgirl says' />
      </div>
      <TextWall />
    </>
  );
}
