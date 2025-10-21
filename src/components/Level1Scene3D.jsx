import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { PurpleFabricClue, HeadphoneJackClue } from './ClueObjects3D';
import * as THREE from 'three';
import particleFire from 'three-particle-fire';

// Initialize particle fire
particleFire.install({ THREE: THREE });

// Night sky background - compensating for horizontal stretching
function NightSkyBackground() {
  const skyTexture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/src/images/nightsky.jpg');
    // Set wrapping and repeat to compensate for stretching
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    // Repeat the texture horizontally to reduce stretching
    texture.repeat.set(2.5, 1);
    // Offset to hide seam outside viewport (25% = 0.25, or ~90 degrees)
    texture.offset.set(0.25, 0);
    return texture;
  }, []);

  return (
    <mesh position={[0, 125, 0]}>
      {/* Use a large cylinder for rectangular skybox image - shifted up 25% */}
      <cylinderGeometry args={[500, 500, 500, 48, 1, true]} />
      <meshBasicMaterial
        map={skyTexture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// Animated falling snowflakes component
function Snowflakes() {
  const count = 300;
  const pointsRef = useRef();

  // Generate initial positions and velocities
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50; // x
      positions[i * 3 + 1] = Math.random() * 30 + 5; // y - start above
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z

      // Random fall speed and drift
      velocities.push({
        y: -0.02 - Math.random() * 0.03, // Fall speed
        x: (Math.random() - 0.5) * 0.01, // Horizontal drift
        z: (Math.random() - 0.5) * 0.01
      });
    }

    return { positions, velocities };
  }, [count]);

  // Animate snowflakes falling
  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions
      positions[i3] += particleData.velocities[i].x; // x
      positions[i3 + 1] += particleData.velocities[i].y; // y
      positions[i3 + 2] += particleData.velocities[i].z; // z

      // Reset snowflake to top when it falls below ground
      if (positions[i3 + 1] < -5) {
        positions[i3 + 1] = 35;
        positions[i3] = (Math.random() - 0.5) * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 50;
      }

      // Keep snowflakes in bounds horizontally
      if (Math.abs(positions[i3]) > 25) {
        positions[i3] = (Math.random() - 0.5) * 50;
      }
      if (Math.abs(positions[i3 + 2]) > 25) {
        positions[i3 + 2] = (Math.random() - 0.5) * 50;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particleData.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Moon with NASA texture maps - bright and emissive like menu screen
function Moon() {
  const [moonTexture, displacementMap] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();

    // Load NASA moon texture
    const texture = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"
    );

    // Load displacement map
    const displacement = textureLoader.load(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"
    );

    return [texture, displacement];
  }, []);

  return (
    <group position={[8, 6, -15]}>
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          displacementMap={displacementMap}
          displacementScale={0.06}
          bumpMap={displacementMap}
          bumpScale={0.04}
          roughness={0.9}
          metalness={0}
          emissive="#fefcd7"
          emissiveIntensity={0.9}
          emissiveMap={moonTexture}
        />
      </mesh>
      {/* Strong directional light simulating sun illuminating the moon */}
      <directionalLight
        position={[2, 1, 5]}
        intensity={0.6}
        color="#eeeeff"
        target-position={[0, 0, 0]}
      />
      {/* Moon's light illuminating the scene */}
      <pointLight intensity={0.8} distance={50} color="#e8f4ff" />
    </group>
  );
}

// Snowy Cottage - Enhanced building with more detail
function Outpost() {
  const iciclePositions = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      angle: (i / 12) * Math.PI * 2,
      length: 0.4 + Math.random() * 0.4
    }))
  , []);

  return (
    <group position={[-6, -5, -8]}>
      {/* Main building - wooden cottage */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>

      {/* Wood planks texture simulation */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`plank-${i}`} position={[0, 0.2 + i * 0.4, 2.02]}>
          <boxGeometry args={[4, 0.05, 0.01]} />
          <meshStandardMaterial color="#6d5d47" roughness={0.95} />
        </mesh>
      ))}

      {/* Roof - snow-covered with overhang */}
      <mesh position={[0, 3.75, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.2, 1.8, 4]} />
        <meshStandardMaterial color="#efeffe" roughness={0.8} />
      </mesh>

      {/* Chimney */}
      <group position={[1.2, 3.6, -1.2]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial color="#6d5d5d" roughness={0.9} />
        </mesh>
        {/* Snow cap on chimney */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.95} />
        </mesh>
        {/* Smoke */}
        <pointLight position={[0, 1.5, 0]} intensity={0.3} distance={2} color="#cccccc" />
      </group>

      {/* Door with frame */}
      <mesh position={[0, 0.5, 2.01]}>
        <boxGeometry args={[0.9, 1.6, 0.1]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 2.02]}>
        <boxGeometry args={[0.8, 1.5, 0.08]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      {/* Door handle */}
      <mesh position={[0.3, 0.5, 2.06]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left window with frame and warm glow */}
      <mesh position={[-1.2, 1.5, 2.01]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      <mesh position={[-1.2, 1.5, 2.02]}>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.6} />
      </mesh>
      {/* Window cross bars */}
      <mesh position={[-1.2, 1.5, 2.03]}>
        <boxGeometry args={[0.6, 0.02, 0.05]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <mesh position={[-1.2, 1.5, 2.03]}>
        <boxGeometry args={[0.02, 0.6, 0.05]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <pointLight position={[-1.2, 1.5, 2.5]} intensity={0.5} distance={4} color="#ffaa00" />

      {/* Right window with frame and warm glow */}
      <mesh position={[1.2, 1.5, 2.01]}>
        <boxGeometry args={[0.7, 0.7, 0.1]} />
        <meshStandardMaterial color="#3a2818" roughness={0.8} />
      </mesh>
      <mesh position={[1.2, 1.5, 2.02]}>
        <boxGeometry args={[0.6, 0.6, 0.08]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={0.6} />
      </mesh>
      {/* Window cross bars */}
      <mesh position={[1.2, 1.5, 2.03]}>
        <boxGeometry args={[0.6, 0.02, 0.05]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <mesh position={[1.2, 1.5, 2.03]}>
        <boxGeometry args={[0.02, 0.6, 0.05]} />
        <meshStandardMaterial color="#3a2818" />
      </mesh>
      <pointLight position={[1.2, 1.5, 2.5]} intensity={0.5} distance={4} color="#ffaa00" />

      {/* Snow bank at base of cottage */}
      <mesh position={[0, -0.2, 2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Icicles hanging from roof edge */}
      {iciclePositions.map((data, i) => {
        const radius = 2.2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(data.angle) * radius,
              2.5,
              Math.sin(data.angle) * radius
            ]}
            rotation={[Math.PI, 0, 0]}
          >
            <coneGeometry args={[0.08, data.length, 8]} />
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

// Snow ground with subtle perlin noise texture
function SnowGround() {
  // Create terrain with subtle perlin-like noise
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(100, 100, 150, 150);
    const positions = geometry.attributes.position.array;

    // Subtle pseudo-perlin noise function
    const noise = (x, y) => {
      let value = 0;
      let amplitude = 1.3;
      let frequency = 0.5; // Higher frequency for finer detail

      // Multiple octaves for natural-looking terrain
      for (let i = 0; i < 4; i++) {
        const nx = x * frequency;
        const ny = y * frequency;

        // Mix of sin/cos for varied terrain
        value += amplitude * (
          Math.sin(nx) * Math.cos(ny) +
          Math.sin(nx * 0.7 + 3.13) * Math.cos(ny * 1.3 + 1.58) +
          Math.sin(nx * 1.8 + 2.1) * Math.sin(ny * 0.9 + 0.5)
        ) / 3;

        amplitude *= 0.5;
        frequency *= 2.1;
      }
      return value;
    };

    // Apply noise to terrain vertices with low amplitude
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Z is height - very subtle undulation for texture only
      positions[i + 2] = noise(x, y) * 0.15; // Very low amplitude (was 3.5 in menu)
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, 0]}
      receiveShadow
      geometry={terrainGeometry}
    >
      <meshStandardMaterial
        color="#e8f4ff"
        roughness={0.95}
        metalness={0}
        flatShading={false}
      />
    </mesh>
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
            position={[pos[0], -4.86, pos[1]]}
            rotation={[-Math.PI / 2, 0, i % 2 ? 0.2 : -0.2]}
            onClick={collected ? undefined : onClick}
            onPointerOver={collected ? undefined : onHover}
            onPointerOut={collected ? undefined : onUnhover}
          >
            <circleGeometry args={[0.15, 16]} />
            <meshStandardMaterial
              color={collected ? '#999999' : '#c8d8bc'}
              emissive={collected ? '#000000' : (hovered ? '#aaaabb' : '#448899')}
              emissiveIntensity={collected ? 0 : (hovered ? 1.2 : 0.01)}
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

// Particle fire effect
function ParticleFire({ position }) {
  const meshRef = useRef();
  const { camera, size } = useThree();

  // Create fire geometry and material
  const [geometry, material] = useMemo(() => {
    const fireRadius = 0.2;
    const fireHeight = 0.8;
    const particleCount = 400;

    const geo = new particleFire.Geometry(fireRadius, fireHeight, particleCount);
    const mat = new particleFire.Material({ color: 0xff4400 });
    mat.setPerspective(camera.fov, size.height);

    return [geo, mat];
  }, [camera.fov, size.height]);

  // Update material each frame
  useFrame((state, delta) => {
    if (material) {
      material.update(delta);
    }
  });

  // Update perspective on resize
  useEffect(() => {
    if (material) {
      material.setPerspective(camera.fov, size.height);
    }
  }, [camera.fov, size.height, material]);

  return (
    <points ref={meshRef} position={position} geometry={geometry} material={material} />
  );
}

// Campfire
function Campfire({ position }) {
  return (
    <group position={position}>
      {/* Fire pit stones */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.2;
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

      {/* Particle fire effect */}
      <ParticleFire position={[0, -4.6, 0]} />

      {/* Fire glow */}
      <pointLight
        position={[0, -4.7, 0]}
        intensity={1.2}
        distance={5}
        color="#ff6600"
      />

      {/* Embers */}
      <mesh position={[0, -4.8, 0]}>
        {/* <sphereGeometry args={[0.1, 8, 8]} /> */}
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

      {/* Pine foliage - lower section */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.8, 2, 8]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} />
      </mesh>

      {/* Snow on lower branches */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.85, 0.2, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Pine foliage - upper section */}
      <mesh position={[0, 3.3, 0]}>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial color="#1a5d3e" roughness={0.8} />
      </mesh>

      {/* Snow on upper branches */}
      <mesh position={[0, 3.3, 0]}>
        <coneGeometry args={[0.65, 0.2, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Snow on top */}
      <mesh position={[0, 4.0, 0]}>
        <coneGeometry args={[0.45, 0.15, 8]} />
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

          {/* Lighting - night scene (reduced for darker atmosphere) */}
          <ambientLight intensity={0.002} color="#4a5f7f" />
          <directionalLight
            position={[8, 8, 5]}
            intensity={0.0001}
            color="#d8e8ff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          {/* Subtle fill light */}
          <hemisphereLight skyColor="#1a2f4f" groundColor="#0a1020" intensity={0.001} />

          {/* Night sky background texture */}
          <NightSkyBackground />

          {/* Moon */}
          <Moon />

          {/* Snowfall */}
          <Snowflakes />

          {/* Environment elements */}
          <SnowGround />
          <Outpost />
          <ForestEdge />
          <Campfire position={[-1.5, 0, 1.5]} />

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
              position={[-2.5, -3.5, -2.6]} // Front of tree, visible to player
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
              position={[-0.7, -4.98, 0.5]} // Between campfire and footprints
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
