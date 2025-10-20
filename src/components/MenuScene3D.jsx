import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Center, Environment } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Falling snowflakes component
function Snowflakes() {
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50; // x
    positions[i * 3 + 1] = Math.random() * 30 - 5; // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Icicle component
function Icicle({ position, length = 1, rotation = 0 }) {
  return (
    <mesh position={position} rotation={[0, 0, rotation]}>
      <coneGeometry args={[0.1, length, 8]} />
      <meshStandardMaterial
        color="#b8dcff"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

// Icicle array along the top
function IcicleArray() {
  const icicles = [];
  const count = 20;

  for (let i = 0; i < count; i++) {
    const x = (i - count / 2) * 1.5;
    const length = 0.5 + Math.random() * 1.5;
    const z = -8;
    icicles.push(
      <Icicle
        key={i}
        position={[x, 8, z]}
        length={length}
        rotation={Math.random() * 0.2 - 0.1}
      />
    );
  }

  return <group>{icicles}</group>;
}

// Snow ground
function SnowGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial
        color="#f0f8ff"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

// Moon
function Moon() {
  return (
    <mesh position={[10, 5, -15]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial
        color="#fefcd7"
        emissive="#f0e68c"
        emissiveIntensity={0.5}
      />
      <pointLight intensity={0.5} distance={20} color="#fefcd7" />
    </mesh>
  );
}

// Mountain silhouettes
function Mountains() {
  return (
    <group position={[0, -5, -20]}>
      {/* Back mountain */}
      <mesh position={[-5, 3, -5]}>
        <coneGeometry args={[8, 10, 4]} />
        <meshStandardMaterial color="#1a2847" />
      </mesh>

      {/* Middle mountain */}
      <mesh position={[3, 4, -3]}>
        <coneGeometry args={[7, 12, 4]} />
        <meshStandardMaterial color="#0a1628" />
      </mesh>

      {/* Front mountain */}
      <mesh position={[-8, 2, 0]}>
        <coneGeometry args={[6, 8, 4]} />
        <meshStandardMaterial color="#2a3856" />
      </mesh>
    </group>
  );
}

// Main scene component
export default function MenuScene3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} color="#b8dcff" />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.5}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-10, 5, -5]} intensity={0.3} color="#6b9dff" />

          {/* Sky elements */}
          <Stars
            radius={100}
            depth={50}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          <Moon />
          <Snowflakes />

          {/* Scene elements */}
          <Mountains />
          <IcicleArray />
          <SnowGround />

          {/* Optional: subtle rotation control (disabled for fixed camera) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
