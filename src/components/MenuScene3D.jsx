import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Center, Environment } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

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
    <mesh>
      {/* Use a large cylinder for rectangular skybox image */}
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

// Icicle component - pointing downward
function Icicle({ position, length = 1, rotation = 0, tiltAngle = 0 }) {
  return (
    <mesh position={position} rotation={[Math.PI, 0, tiltAngle]}>
      <coneGeometry args={[0.15, length, 8]} />
      <meshStandardMaterial
        color="#b8dcff"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

// Icicle array along the top
function IcicleArray() {
  const icicles = useMemo(() => {
    const count = 25;
    const icicleData = [];

    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 1.5;
      const length = 1.0 + Math.random() * 2.5; // Increased size with random offset
      const z = -8;
      const tiltAngle = (Math.random() - 0.7) * (10 * Math.PI / 180); // Random angle between -5 and +5 degrees

      icicleData.push({
        key: i,
        position: [x, 8, z],
        length,
        tiltAngle
      });
    }

    return icicleData;
  }, []);

  return (
    <group>
      {icicles.map((icicle) => (
        <Icicle
          key={icicle.key}
          position={icicle.position}
          length={icicle.length}
          tiltAngle={icicle.tiltAngle}
        />
      ))}
    </group>
  );
}

// Snow ground with perlin noise undulation
function SnowGround() {
  // Create terrain with perlin-like noise
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(200, 100, 200, 100);
    const positions = geometry.attributes.position.array;

    // Improved pseudo-perlin noise function with better randomness
    const noise = (x, y) => {
      let value = 0;
      let amplitude = 1;
      let frequency = 0.05; // Increased from 0.015 for more visible hills

      // Multiple octaves for natural-looking terrain
      for (let i = 0; i < 5; i++) {
        const nx = x * frequency;
        const ny = y * frequency;

        // Mix of sin/cos for more varied terrain
        value += amplitude * (
          Math.sin(nx) * Math.cos(ny) +
          Math.sin(nx * 0.7 + 3.14) * Math.cos(ny * 1.3 + 1.57) +
          Math.sin(nx * 1.8 + 2.1) * Math.sin(ny * 0.9 + 0.5)
        ) / 3;

        amplitude *= 0.4;
        frequency *= 2.1; // Slightly irregular multiplier for more organic look
      }
      return value;
    };

    // Apply noise to terrain vertices
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];

      // Z is height - add undulation with more variation
      positions[i + 2] = noise(x, y) * 3.5; // Increased amplitude
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -5, 0]}
      receiveShadow
      castShadow
      geometry={terrainGeometry}
    >
      <meshStandardMaterial
        color="#f0f8ff"
        roughness={0.85}
        metalness={0}
        flatShading={false}
      />
    </mesh>
  );
}

// Moon with NASA texture maps - bright and emissive
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
    <group position={[10, 5, -15]}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          displacementMap={displacementMap}
          displacementScale={0.08}
          bumpMap={displacementMap}
          bumpScale={0.05}
          roughness={0.9}
          metalness={0}
          emissive="#fefcd7"
          emissiveIntensity={0.8}
          emissiveMap={moonTexture}
        />
      </mesh>
      {/* Strong directional light simulating sun illuminating the moon */}
      <directionalLight
        position={[2, 1, 5]}
        intensity={0.5}
        color="#ccddff"
        target-position={[0, 0, 0]}
      />
    </group>
  );
}

// Tree component for menu scene
function Tree({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 8]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Pine foliage - lower section */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.6, 1.5, 8]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.8} />
      </mesh>

      {/* Snow on lower branches */}
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.5, 0.8, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Pine foliage - upper section */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.45, 1.2, 8]} />
        <meshStandardMaterial color="#1a5d3e" roughness={0.8} />
      </mesh>

      {/* Snow on upper branches */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.4, 0.6, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>

      {/* Snow on top */}
      {/* Radius, Height, RadialSegments */}
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[0.15, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
    </group>
  );
}

// Forest of trees
function Forest() {
  const trees = useMemo(() => {
    const treePositions = [];

    // Back row - distant forest
    for (let i = -10; i <= 10; i++) {
      treePositions.push({
        pos: [i * 3 + (Math.random() - 0.5) * 2, -5, -25 + (Math.random() - 0.5) * 3],
        scale: 0.8 + Math.random() * 0.4
      });
    }

    // Middle-back row
    for (let i = -8; i <= 8; i++) {
      treePositions.push({
        pos: [i * 3.5 + (Math.random() - 0.5) * 2, -5, -18 + (Math.random() - 0.5) * 2],
        scale: 0.9 + Math.random() * 0.5
      });
    }

    // Middle row - sides only for clearing
    for (let i = -6; i <= -4; i++) {
      treePositions.push({
        pos: [i * 3.5 + (Math.random() - 0.5) * 1.5, -5, -12 + (Math.random() - 0.5) * 2],
        scale: 1.0 + Math.random() * 0.5
      });
    }
    for (let i = 4; i <= 6; i++) {
      treePositions.push({
        pos: [i * 3.5 + (Math.random() - 0.5) * 1.5, -5, -12 + (Math.random() - 0.5) * 2],
        scale: 1.0 + Math.random() * 0.5
      });
    }

    // Front edges
    for (let i = -5; i <= -3; i++) {
      treePositions.push({
        pos: [i * 4 + (Math.random() - 0.5) * 2, -5, -6 + (Math.random() - 0.5) * 2],
        scale: 1.1 + Math.random() * 0.6
      });
    }
    for (let i = 3; i <= 5; i++) {
      treePositions.push({
        pos: [i * 4 + (Math.random() - 0.5) * 2, -5, -6 + (Math.random() - 0.5) * 2],
        scale: 1.1 + Math.random() * 0.6
      });
    }

    return treePositions;
  }, []);

  return (
    <group>
      {trees.map((tree, i) => (
        <Tree key={i} position={tree.pos} scale={tree.scale} />
      ))}
    </group>
  );
}

// Main scene component
export default function MenuScene3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting - moonlit scene (reduced to 25% brightness) */}
          <ambientLight intensity={0.025} color="#2a3f5f" />

          {/* Main moonlight from the moon's position - angled for dramatic shadows */}
          <directionalLight
            position={[8, 6, -20]}
            intensity={0.1}
            color="#ddeeff"
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
            shadow-camera-near={0.1}
            shadow-camera-far={150}
            shadow-bias={-0.0001}
          />

          {/* Subtle fill light */}
          <hemisphereLight skyColor="#1a2fff" groundColor="#0a10ff" intensity={0.01} />

          {/* Night sky background */}
          <NightSkyBackground />

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
          <Forest />
          <IcicleArray />
          <SnowGround />

          {/* Optional: subtle rotation control (disabled for fixed camera) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
