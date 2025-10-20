import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * InteractiveClue - A 3D clickable clue object with hover glow effect
 * @param {Object} props
 * @param {Array} props.position - [x, y, z] position in 3D space
 * @param {String} props.icon - Emoji icon for the clue
 * @param {String} props.name - Name of the clue
 * @param {Boolean} props.collected - Whether the clue has been collected
 * @param {Function} props.onClick - Callback when clue is clicked
 * @param {String} props.color - Base color of the clue
 */
export default function InteractiveClue({
  position,
  icon,
  name,
  collected = false,
  onClick,
  color = '#ffd700'
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();
  const glowRef = useRef();
  const pulseRef = useRef(0);

  // Animate glow effect
  useFrame((state, delta) => {
    if (!collected && hovered && glowRef.current) {
      pulseRef.current += delta * 2;
      const pulse = Math.sin(pulseRef.current) * 0.3 + 0.7;
      glowRef.current.scale.setScalar(1.2 + pulse * 0.2);
      glowRef.current.material.opacity = 0.3 * pulse;
    }

    // Gentle floating animation for uncollected clues
    if (!collected && meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (!collected) {
      onClick();
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!collected) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={position}>
      {/* Main clue object */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={collected ? '#666666' : color}
          emissive={collected ? '#000000' : color}
          emissiveIntensity={collected ? 0 : (hovered ? 0.5 : 0.2)}
          transparent
          opacity={collected ? 0.3 : 1}
        />
      </mesh>

      {/* Glow effect (only when not collected and hovered) */}
      {!collected && hovered && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Icon text */}
      <Text
        position={[0, 0, 0.35]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {icon}
      </Text>

      {/* Label below the clue */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color={collected ? '#999999' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
}
