import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Center, Environment, useGLTF } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import LoadingProgress from './LoadingProgress';
import DevControls from './DevControls';
import * as THREE from 'three';

// Night sky background - compensating for horizontal stretching
function NightSkyBackground() {
  const skyTexture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/images/nightsky.jpg');
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

  // Load snowflake texture
  const snowflakeTexture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load('/images/snowflake.png');
  }, []);

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
        size={0.15}
        color="#ffffff"
        map={snowflakeTexture}
        transparent
        opacity={0.8}
        sizeAttenuation
        alphaTest={0.1}
        depthWrite={false}
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
        emissive="#6699ff"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Icicle array along the top
function IcicleArray() {
  const icicles = useMemo(() => {
    const count = 45;
    const icicleData = [];

    for (let i = 0; i < count; i++) {
      const x = (i - count / 2) * 1.5;
      const length = 1.0 + Math.random() * 5.5; // Increased size with random offset
      const z = -8;
      const tiltAngle = (Math.random() - 0.8) * (10 * Math.PI / 180); // Random angle between -5 and +5 degrees

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

    // Load moon textures from local files (much faster than web)
    const texture = textureLoader.load('/images/lroc_color_poles_1k.jpg');
    const displacement = textureLoader.load('/images/ldem_3_8bit.jpg');

    return [texture, displacement];
  }, []);

  return (
    <group position={[10, 9, -15]}>
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

// Tree component for menu scene - using TreeSet2/PineTree.glb
function Tree({ position, scale = 1 }) {
  const { scene } = useGLTF('/models/TreeSet2/PineTree.glb');

  // Load tree textures
  const [barkTexture, leavesTexture] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const bark = textureLoader.load('/models/TreeSet2/Textures/BarkDecidious0194_7_S.jpg');
    const leaves = textureLoader.load('/models/TreeSet2/Textures/Leaves0142_4_S.png');

    // Set proper encoding
    bark.encoding = THREE.sRGBEncoding;
    leaves.encoding = THREE.sRGBEncoding;

    return [bark, leaves];
  }, []);

  // Clone the tree model
  const treeModel = useMemo(() => {
    const clone = scene.clone();

    // Ensure materials are properly set up and shadows enabled
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();

          // Apply textures based on material properties
          const matName = child.material.name?.toLowerCase() || '';

          if (matName.includes('bark') || matName.includes('trunk') || matName.includes('wood')) {
            child.material.map = barkTexture;
            child.material.roughness = 0.9;
            child.material.metalness = 0;
          } else if (matName.includes('leaf') || matName.includes('leaves') || matName.includes('needle')) {
            child.material.map = leavesTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.5;
            child.material.side = THREE.DoubleSide;
            child.material.roughness = 0.8;
            child.material.metalness = 0;
          }

          child.material.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene, position, barkTexture, leavesTexture]);

  return (
    <group position={position}>
      <primitive
        object={treeModel}
        scale={scale * 0.8}
      />
    </group>
  );
}

// Preload the tree model
useGLTF.preload('/models/TreeSet2/PineTree.glb');

// Floating forest spirit lights
function ForestSprites() {
  const sprites = useRef([]);
  const spriteLights = useRef([]);

  // Initialize sprite paths
  const spritePaths = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      baseX: (i - 2) * 8, // Spread across the forest
      baseZ: -10 - Math.random() * 10,
      radius: 3 + Math.random() * 2,
      speed: 0.3 + Math.random() * 0.3,
      heightOffset: 0 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);

  // Animate sprites
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    spritePaths.forEach((path, i) => {
      if (spriteLights.current[i]) {
        // Weaving motion in a figure-8 pattern
        const angle = time * path.speed + path.phase;
        const x = path.baseX + Math.sin(angle) * path.radius;
        const y = -2 + path.heightOffset + Math.sin(angle * 2) * 1.5;
        const z = path.baseZ + Math.cos(angle) * path.radius;

        spriteLights.current[i].position.set(x, y, z);

        // Gentle pulsing
        const pulse = 0.3 + Math.sin(time * 2 + path.phase) * 0.2;
        spriteLights.current[i].intensity = pulse;
      }
    });
  });

  return (
    <group>
      {spritePaths.map((path, i) => (
        <pointLight
          key={i}
          ref={(el) => (spriteLights.current[i] = el)}
          color="#88aaff"
          intensity={0.3}
          distance={6}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
      ))}
    </group>
  );
}

// Forest of trees - clustered left and right with winding path down center
function Forest() {
  const trees = useMemo(() => {
    const treePositions = [];

    // Helper function to get terrain height at position (simplified version)
    const getTerrainHeight = (x, z) => {
      // Simplified terrain height calculation matching SnowGround
      const noise = (x, z) => {
        let value = 0;
        let amplitude = 1;
        let frequency = 0.05;

        for (let i = 0; i < 5; i++) {
          const nx = x * frequency;
          const nz = z * frequency;
          value += amplitude * (
            Math.sin(nx) * Math.cos(nz) +
            Math.sin(nx * 0.7 + 3.14) * Math.cos(nz * 1.3 + 1.57) +
            Math.sin(nx * 1.8 + 2.1) * Math.sin(nz * 0.9 + 0.5)
          ) / 3;
          amplitude *= 0.4;
          frequency *= 2.1;
        }
        return value;
      };
      return -5 + noise(x, z) * 3.5;
    };

    // Create winding path down center by defining path curve
    const pathWidth = 6; // Width of the clear path

    // Far back - both sides
    for (let i = 0; i < 15; i++) {
      const z = -25 + (Math.random() - 0.5) * 4;
      const pathOffset = Math.sin(z * 0.3) * 2; // Winding effect

      // Left cluster
      const xLeft = -8 - Math.random() * 8 + pathOffset;
      treePositions.push({
        pos: [xLeft, getTerrainHeight(xLeft, z), z],
        scale: 0.7 + Math.random() * 0.4
      });

      // Right cluster
      const xRight = 8 + Math.random() * 8 + pathOffset;
      treePositions.push({
        pos: [xRight, getTerrainHeight(xRight, z), z],
        scale: 0.7 + Math.random() * 0.4
      });
    }

    // Middle-back - denser clusters
    for (let i = 0; i < 12; i++) {
      const z = -18 + (Math.random() - 0.5) * 4;
      const pathOffset = Math.sin(z * 0.3) * 2.5;

      // Left cluster
      const xLeft = -6 - Math.random() * 6 + pathOffset;
      treePositions.push({
        pos: [xLeft, getTerrainHeight(xLeft, z), z],
        scale: 0.8 + Math.random() * 0.5
      });

      // Right cluster
      const xRight = 6 + Math.random() * 6 + pathOffset;
      treePositions.push({
        pos: [xRight, getTerrainHeight(xRight, z), z],
        scale: 0.8 + Math.random() * 0.5
      });
    }

    // Middle - sides of winding path
    for (let i = 0; i < 10; i++) {
      const z = -12 + (Math.random() - 0.5) * 3;
      const pathOffset = Math.sin(z * 0.3) * 3;

      // Left cluster
      const xLeft = -5 - Math.random() * 4 + pathOffset;
      if (Math.abs(xLeft - pathOffset) > pathWidth / 2) {
        treePositions.push({
          pos: [xLeft, getTerrainHeight(xLeft, z), z],
          scale: 0.9 + Math.random() * 0.5
        });
      }

      // Right cluster
      const xRight = 5 + Math.random() * 4 + pathOffset;
      if (Math.abs(xRight - pathOffset) > pathWidth / 2) {
        treePositions.push({
          pos: [xRight, getTerrainHeight(xRight, z), z],
          scale: 0.9 + Math.random() * 0.5
        });
      }
    }

    // Front edges - larger trees framing the path
    for (let i = 0; i < 6; i++) {
      const z = -6 + (Math.random() - 0.5) * 2;
      const pathOffset = Math.sin(z * 0.3) * 3.5;

      // Left cluster
      const xLeft = -6 - Math.random() * 3 + pathOffset;
      if (Math.abs(xLeft - pathOffset) > pathWidth / 2) {
        treePositions.push({
          pos: [xLeft, getTerrainHeight(xLeft, z), z],
          scale: 1.0 + Math.random() * 0.6
        });
      }

      // Right cluster
      const xRight = 6 + Math.random() * 3 + pathOffset;
      if (Math.abs(xRight - pathOffset) > pathWidth / 2) {
        treePositions.push({
          pos: [xRight, getTerrainHeight(xRight, z), z],
          scale: 1.0 + Math.random() * 0.6
        });
      }
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

// Camera tracker component - updates state with camera position
function CameraTracker({ onUpdate, fov }) {
  const { camera } = useThree();

  useFrame(() => {
    onUpdate({
      position: [camera.position.x, camera.position.y, camera.position.z],
      rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z],
      fov: camera.fov
    });
  });

  // Update camera FOV when changed
  useEffect(() => {
    if (camera && fov !== camera.fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}

// Main scene component
export default function MenuScene3D() {
  const [devMode] = useState(true); // Set to false in production
  const [cameraInfo, setCameraInfo] = useState({
    position: [0, 2, 10],
    rotation: [0, 0, 0],
    fov: 60
  });
  const [fov, setFov] = useState(60);

  // Update camera FOV
  const handleFovChange = (newFov) => {
    setFov(newFov);
  };

  return (
    <div className="absolute inset-0">
      {/* Loading Progress Indicator */}
      <LoadingProgress />

      {/* Dev Controls Panel */}
      {devMode && (
        <DevControls
          cameraPosition={cameraInfo.position}
          cameraRotation={cameraInfo.rotation}
          fov={fov}
          onFovChange={handleFovChange}
          objects={[]}
        />
      )}

      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Camera tracking for dev mode */}
          {devMode && <CameraTracker onUpdate={setCameraInfo} fov={fov} />}

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

          <Moon />

          {/* Night sky background */}
          <NightSkyBackground />

          <Snowflakes />

          {/* Scene elements */}
          <Forest />
          <ForestSprites />
          <IcicleArray />
          <SnowGround />

          {/* Dev mode orbit controls */}
          {devMode && <OrbitControls makeDefault />}

        </Suspense>
      </Canvas>
    </div>
  );
}
