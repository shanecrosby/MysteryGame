import { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/**
 * PurpleFabricClue - A torn piece of purple fabric stuck to a tree
 */
export function PurpleFabricClue({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, collected, hovered, onHover, onUnhover, onClick }) {
  const meshRef = useRef();
  const pulseRef = useRef(0);
  const { scene } = useGLTF('/models/blanket/shapespark_blankets-set.gltf');

  // Load the blanket texture and use it as a bump/roughness map
  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/models/blanket/blanket.webp');
    return tex;
  }, []);

  // Clone the blanket model and apply purple color with texture as bump/roughness
  const blanketModel = useMemo(() => {
    // Find blanket_01 or blanket_02 in the scene
    let blanketMesh = null;
    scene.traverse((child) => {
      if (child.name === 'blanket_01' || child.name === 'blanket_02') {
        if (!blanketMesh) blanketMesh = child;
      }
    });

    const clone = blanketMesh ? blanketMesh.clone() : scene.clone();

    // Apply purple material with texture as bump/roughness
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Create new purple material using the texture as bump/roughness
        child.material = new THREE.MeshStandardMaterial({
          color: collected ? '#666666' : '#9370DB',
          bumpMap: texture,
          bumpScale: 0.02,
          roughnessMap: texture,
          roughness: 0.9,
          metalness: 0,
          emissive: collected ? '#000000' : '#8A2BE2',
          emissiveIntensity: collected ? 0 : (hovered ? 0.8 : 0.3),
          transparent: collected,
          opacity: collected ? 0.3 : 1,
          side: THREE.DoubleSide
        });
      }
    });

    return clone;
  }, [scene, texture, collected, hovered]);

  useFrame((state, delta) => {
    if (!collected && hovered) {
      pulseRef.current += delta * 2;
    }

    // Motion removed - fabric stays static
  });

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Blanket model */}
      <primitive
        object={blanketModel}
        scale={1}
        rotation={[0, 0, 0]}
        onClick={collected ? undefined : onClick}
        onPointerOver={collected ? undefined : onHover}
        onPointerOut={collected ? undefined : onUnhover}
      />

      {/* Point light when hovered */}
      {!collected && hovered && (
        <pointLight position={[0, 0, 0]} intensity={1.5} distance={0} color="#9370DB" />
      )}
    </group>
  );
}

// Preload the blanket model
useGLTF.preload('/models/blanket/shapespark_blankets-set.gltf');

/**
 * HeadphoneJackClue - A coiled headphone cable on the ground
 */
export function HeadphoneJackClue({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, collected, hovered, onHover, onUnhover, onClick }) {
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
    <group position={position} rotation={rotation} scale={scale}>
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
