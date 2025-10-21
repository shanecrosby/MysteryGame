import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PurpleFabricClue - A torn piece of purple fabric stuck to a tree
 */
export function PurpleFabricClue({ position, collected, hovered, onHover, onUnhover, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (!collected && hovered && glowRef.current) {
      pulseRef.current += delta * 2;
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7;
      glowRef.current.material.opacity = 0.4 * pulse;
    }

    if (!collected && meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Fabric piece - torn and hanging */}
      <mesh
        ref={meshRef}
        onClick={collected ? undefined : onClick}
        onPointerOver={collected ? undefined : onHover}
        onPointerOut={collected ? undefined : onUnhover}
        rotation={[0, 0, 0.2]}
      >
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial
          color={collected ? '#666666' : '#9370DB'}
          side={THREE.DoubleSide}
          emissive={collected ? '#000000' : '#8A2BE2'}
          emissiveIntensity={collected ? 0 : (hovered ? 0.8 : 0.3)}
          transparent
          opacity={collected ? 0.3 : 1}
        />
      </mesh>

      {/* Point light when hovered */}
      {!collected && hovered && (
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={3} color="#9370DB" />
      )}
    </group>
  );
}

/**
 * HeadphoneJackClue - A coiled headphone cable on the ground
 */
export function HeadphoneJackClue({ position, collected, hovered, onHover, onUnhover, onClick }) {
  const glowRef = useRef();
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (!collected && hovered && glowRef.current) {
      pulseRef.current += delta * 2;
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7;
      glowRef.current.material.opacity = 0.4 * pulse;
    }
  });

  return (
    <group position={position}>
      {/* Headphone jack - just the connector piece */}
      <mesh
        onClick={collected ? undefined : onClick}
        onPointerOver={collected ? undefined : onHover}
        onPointerOut={collected ? undefined : onUnhover}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial
          color={collected ? '#666666' : '#111111'}
          emissive={collected ? '#000000' : '#666666'}
          emissiveIntensity={collected ? 0 : (hovered ? 1.5 : 0.1)}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={collected ? 0.3 : 1}
        />
      </mesh>

      {/* Point light when hovered */}
      {!collected && hovered && (
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={3} color="#FFD700" />
      )}
    </group>
  );
}

/**
 * FootprintsClue - Special clickable area for footprints (invisible marker)
 */
export function FootprintsClue({ position, collected, hovered, onHover, onUnhover, onClick }) {
  const glowRef = useRef();
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (!collected && hovered && glowRef.current) {
      pulseRef.current += delta * 2;
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7;
      glowRef.current.material.opacity = 0.3 * pulse;
    }
  });

  return (
    <group position={position}>
      {/* Invisible clickable area */}
      <mesh
        onClick={collected ? undefined : onClick}
        onPointerOver={collected ? undefined : onHover}
        onPointerOut={collected ? undefined : onUnhover}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.5, 16]} />
        <meshStandardMaterial
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Point light when hovered */}
      {!collected && hovered && (
        <pointLight position={[0, 0.2, 0]} intensity={2} distance={4} color="#9999ff" />
      )}
    </group>
  );
}
