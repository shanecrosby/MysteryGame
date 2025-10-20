import { Canvas, useThree } from '@react-three/fiber';
import { Stars, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { PurpleFabricClue, HeadphoneJackClue } from './ClueObjects3D';
import * as THREE from 'three';

// Falling snowflakes
function Snowflakes() {
  const count = 300;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 30 - 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Moon
function Moon() {
  return (
    <group position={[8, 6, -15]}>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#fefcd7"
          emissive="#f0e68c"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight intensity={0.8} distance={30} color="#fefcd7" />
    </group>
  );
}

// Outpost building - FIXED: aligned to ground, roof rotated, icicles flipped
function Outpost() {
  return (
    <group position={[-6, -5, -8]}>
      {/* Main building - sits on ground */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>

      {/* Roof - rotated 45 degrees, positioned on top of building */}
      <mesh position={[0, 3.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.5, 2.01]}>
        <boxGeometry args={[0.8, 1.5, 0.1]} />
        <meshStandardMaterial color="#4a3520" />
      </mesh>

      {/* Window with warm glow */}
      <mesh position={[1, 1.5, 2.01]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.5} />
      </mesh>
      {/* Window light */}
      <pointLight position={[1, 1.5, 2.5]} intensity={0.5} distance={4} color="#ffaa00" />

      {/* Icicles hanging from roof edge - FIXED: pointing down from roof bottom */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 2.1;
        const length = 0.4 + Math.random() * 0.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              3.0, // Aligned with roof bottom
              Math.sin(angle) * radius
            ]}
            rotation={[Math.PI, 0, 0]} // Flipped to point down
          >
            <coneGeometry args={[0.08, length, 8]} />
            <meshStandardMaterial
              color="#b8dcff"
              transparent
              opacity={0.7}
              roughness={0.1}
              metalness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Snow ground
function SnowGround() {
  // Generate fixed random positions for snow mounds (useMemo ensures they don't change)
  const snowMounds = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      x: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 30,
      rotation: Math.random() * Math.PI,
      size: 0.5 + Math.random()
    }));
  }, []);

  return (
    <>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#e8f4ff"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Snow mounds for texture - fixed positions */}
      {snowMounds.map((mound, i) => (
        <mesh
          key={i}
          position={[mound.x, -4.95, mound.z]}
          rotation={[-Math.PI / 2, 0, mound.rotation]}
        >
          <circleGeometry args={[mound.size, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}

// Footprints trail in the snow - interactive with hover glow
function Footprints({ hovered, onClick, onHover, onUnhover, collected }) {
  const footprintPositions = useMemo(() => {
    const positions = [];
    // Closer to player, starting nearer
    for (let i = 0; i < 16; i++) {
      const z = -1 - i * 0.9;
      const x = 0.5 + Math.sin(i * 0.3) * 0.6;
      positions.push([x, z]);
      positions.push([x + 0.5, z - 0.25]);
    }
    return positions;
  }, []);

  return (
    <group>
      {footprintPositions.map((pos, i) => (
        <group key={i}>
          {/* Footprint mesh - clickable and interactive */}
          <mesh
            position={[pos[0], -4.96, pos[1]]}
            rotation={[-Math.PI / 2, 0, i % 2 ? 0.2 : -0.2]}
            onClick={onClick}
            onPointerOver={onHover}
            onPointerOut={onUnhover}
          >
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial
              color={collected ? '#999999' : '#c8d8e8'}
              emissive={collected ? '#000000' : (hovered ? '#aaaaff' : '#4488ff')}
              emissiveIntensity={collected ? 0 : (hovered ? 1.2 : 0.15)}
              transparent
              opacity={collected ? 0.3 : 1}
            />
          </mesh>

          {/* Individual point light - brighter when hovered */}
          {!collected && (
            <pointLight
              position={[pos[0], -4.7, pos[1]]}
              intensity={hovered ? 0.2 : 0}
              distance={hovered ? 1.5 : 0}
              color="#4488ff"
            />
          )}
        </group>
      ))}
    </group>
  );
}

// Campfire
function Campfire({ position }) {
  return (
    <group position={position}>
      {/* Fire pit stones */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.3;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, -4.85, Math.sin(angle) * radius]}
          >
            <boxGeometry args={[0.15, 0.2, 0.15]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Fire glow */}
      <pointLight
        position={[0, -4.7, 0]}
        intensity={1}
        distance={4}
        color="#ff6600"
      />

      {/* Embers */}
      <mesh position={[0, -4.8, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ff3300"
          emissive="#ff6600"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

// Tree with purple fabric attached
function Tree({ position, hasFabric = false }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 2, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Pine foliage */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial color="#1a5d3e" roughness={0.8} />
      </mesh>

      {/* Snow on branches */}
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[0.65, 0.2, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Branch stub for fabric (if this tree has the fabric clue) */}
      {hasFabric && (
        <mesh position={[0.4, 1.8, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.08, 0.5, 6]} />
          <meshStandardMaterial color="#3d2817" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

// Forest edge - creating a clearing effect
function ForestEdge() {
  const treePositions = [
    // Far back row - very distant
    { pos: [-8, -5, -18], fabric: false },
    { pos: [-6, -5, -17], fabric: false },
    { pos: [-4, -5, -19], fabric: false },
    { pos: [-10, -5, -16], fabric: false },
    { pos: [-12, -5, -18], fabric: false },
    { pos: [-2, -5, -17], fabric: false },
    { pos: [0, -5, -18], fabric: false },
    { pos: [2, -5, -19], fabric: false },
    { pos: [4, -5, -17], fabric: false },
    { pos: [6, -5, -16], fabric: false },
    { pos: [8, -5, -18], fabric: false },
    { pos: [10, -5, -17], fabric: false },
    { pos: [12, -5, -19], fabric: false },

    // Back row - distant
    { pos: [-8, -5, -12], fabric: false },
    { pos: [-6, -5, -14], fabric: false },
    { pos: [-4, -5, -13], fabric: false },
    { pos: [-10, -5, -15], fabric: false },
    { pos: [-12, -5, -13], fabric: false },
    { pos: [-14, -5, -14], fabric: false },
    { pos: [4, -5, -13], fabric: false },
    { pos: [6, -5, -15], fabric: false },
    { pos: [8, -5, -14], fabric: false },
    { pos: [2, -5, -16], fabric: false },
    { pos: [10, -5, -12], fabric: false },
    { pos: [12, -5, -15], fabric: false },
    { pos: [14, -5, -13], fabric: false },

    // Middle row - only on sides, creating clearing
    { pos: [-9, -5, -8], fabric: false },
    { pos: [-11, -5, -10], fabric: false },
    { pos: [-13, -5, -9], fabric: false },
    { pos: [9, -5, -8], fabric: false },
    { pos: [11, -5, -9], fabric: false },
    { pos: [13, -5, -10], fabric: false },

    // Clearing edge - only tree with fabric and far sides
    { pos: [-3, -5, -3], fabric: true }, // Tree with fabric - only front tree
    { pos: [-8, -5, -5], fabric: false },
    { pos: [-10, -5, -6], fabric: false },
    { pos: [8, -5, -5], fabric: false },
    { pos: [10, -5, -6], fabric: false }
  ];

  return (
    <group>
      {treePositions.map((tree, i) => (
        <Tree key={i} position={tree.pos} hasFabric={tree.fabric} />
      ))}
    </group>
  );
}

/**
 * Level1Scene3D - The 3D environment for Level 1: Frozen Outpost
 * @param {Object} props
 * @param {Array} props.clues - Array of clue objects from scene data
 * @param {Function} props.onClueClick - Callback when a clue is clicked
 */
export default function Level1Scene3D({ clues, onClueClick }) {
  const [hoveredClue, setHoveredClue] = useState(null);

  // Find specific clues
  const fabricClue = clues?.find(c => c.id === 'fabric');
  const headphoneClue = clues?.find(c => c.id === 'headphone');
  const footprintsClue = clues?.find(c => c.id === 'footprints');

  const handleHover = (clueId) => {
    setHoveredClue(clueId);
    document.body.style.cursor = 'pointer';
  };

  const handleUnhover = () => {
    setHoveredClue(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Camera - zoomed in, tilted down 5 degrees */}
          <PerspectiveCamera
            makeDefault
            position={[0, -3.5, 3.5]}
            rotation={[-Math.PI / 36, 0, 0]}
            fov={75}
          />

          {/* Lighting - night scene */}
          <ambientLight intensity={0.15} color="#6688bb" />
          <directionalLight
            position={[8, 8, 5]}
            intensity={0.3}
            color="#e8f4ff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Dark night sky background */}
          <color attach="background" args={['#0a0e1a']} />

          {/* Stars */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={5}
            saturation={0}
            fade
            speed={0.3}
          />

          {/* Moon */}
          <Moon />

          {/* Snowfall */}
          <Snowflakes />

          {/* Environment elements */}
          <SnowGround />
          <Outpost />
          <ForestEdge />
          <Campfire position={[-2, 0, 2]} />

          {/* Interactive footprints - entire path is clickable */}
          {footprintsClue && (
            <Footprints
              hovered={hoveredClue === 'footprints'}
              collected={footprintsClue.collected}
              onHover={() => handleHover('footprints')}
              onUnhover={handleUnhover}
              onClick={() => {
                handleUnhover();
                onClueClick(footprintsClue);
              }}
            />
          )}

          {/* Interactive clues using 3D objects */}
          {fabricClue && (
            <PurpleFabricClue
              position={[-2.6, -3.3, -2.5]} // Front of tree, visible to player
              collected={fabricClue.collected}
              hovered={hoveredClue === 'fabric'}
              onHover={() => handleHover('fabric')}
              onUnhover={handleUnhover}
              onClick={() => {
                handleUnhover();
                onClueClick(fabricClue);
              }}
            />
          )}

          {headphoneClue && (
            <HeadphoneJackClue
              position={[-0.7, -4.85, 0.5]} // Between campfire and footprints
              collected={headphoneClue.collected}
              hovered={hoveredClue === 'headphone'}
              onHover={() => handleHover('headphone')}
              onUnhover={handleUnhover}
              onClick={() => {
                handleUnhover();
                onClueClick(headphoneClue);
              }}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
