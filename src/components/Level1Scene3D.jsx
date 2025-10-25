import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF, OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { PurpleFabricClue, HeadphoneJackClue } from './ClueObjects3D';
import LoadingProgress from './LoadingProgress';
import DevControls from './DevControls';
import * as THREE from 'three';
import particleFire from 'three-particle-fire';

// Initialize particle fire
particleFire.install({ THREE: THREE });

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
    texture.offset.set(0.33, 0);
    return texture;
  }, []);

  return (
    <mesh position={[0, 150, 0]}>
      {/* Use a large cylinder for rectangular skybox image - positioned lower to hide top */}
      <cylinderGeometry args={[500, 600, 500, 48, 1, true]} />
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

// Moon with NASA texture maps - bright and emissive like menu screen
function Moon() {
  const [moonTexture, displacementMap] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();

    // Load moon textures from local files (much faster than web)
    const texture = textureLoader.load('/images/lroc_color_poles_1k.jpg');
    const displacement = textureLoader.load('/images/ldem_3_8bit.jpg');

    return [texture, displacement];
  }, []);

  return (
    <group position={[-8, 8, -12]}>
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

// Snowy Cottage - Using House_1.glb model (compressed)
function Outpost({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/models/house/House_1.glb');

  // Load house textures (optimized WebP versions)
  const [colorMap, normalMap, roughnessMap, color3Map, normal3Map, rough3Map] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();

    const color = textureLoader.load('/models/house/Atlas_Color.webp');
    const normal = textureLoader.load('/models/house/Atlas_Norm.webp');
    const rough = textureLoader.load('/models/house/Atlas_Rough.webp');
    const color3 = textureLoader.load('/models/house/Atlas_3_Color.webp');
    const normal3 = textureLoader.load('/models/house/Atlas_3_Norm.webp');
    const rough3 = textureLoader.load('/models/house/Atlas_3_Rough.webp');

    // Set proper encoding
    color.encoding = THREE.sRGBEncoding;
    color3.encoding = THREE.sRGBEncoding;

    return [color, normal, rough, color3, normal3, rough3];
  }, []);

  // Clone house and apply textures
  const houseModel = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();

          // Apply textures based on material name or index
          if (child.material.name && child.material.name.includes('3')) {
            child.material.map = color3Map;
            child.material.normalMap = normal3Map;
            child.material.roughnessMap = rough3Map;
          } else {
            child.material.map = colorMap;
            child.material.normalMap = normalMap;
            child.material.roughnessMap = roughnessMap;
          }

          child.material.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene, colorMap, normalMap, roughnessMap, color3Map, normal3Map, rough3Map]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* New House Model */}
      <primitive
        object={houseModel}
        scale={2}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Chimney smoke light */}
      <pointLight position={[1.2, 5, -1.2]} intensity={0.3} distance={2} color="#cccccc" />
    </group>
  );
}

// Preload the house model
useGLTF.preload('/models/house/House_1.glb');

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
    const fireHeight = 1.2;
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

// Campfire - using GLB model with fire effect
function Campfire({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, hovered, onClick, onHover, onUnhover }) {
  const { scene } = useGLTF('/models/firepit/stone_fire_pit_4k.glb');

  // Load textures manually (only diffuse for now, as EXR requires special loader)
  const diffuseMap = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const diffuse = textureLoader.load('/models/firepit/textures/stone_fire_pit_diff_4k.jpg');
    diffuse.encoding = THREE.sRGBEncoding;
    diffuse.flipY = false;
    return diffuse;
  }, []);

  // Clone the scene and apply textures
  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    // Apply textures and enable shadows
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Apply diffuse texture to the material
        if (child.material) {
          child.material = child.material.clone();

          // Apply diffuse map
          if (diffuseMap) {
            child.material.map = diffuseMap;
          }

          // Set material properties for better appearance
          child.material.roughness = 0.8;
          child.material.metalness = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene, diffuseMap]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Stone fire pit model - positioned at the base */}
      <primitive object={clonedScene} position={[0, -4.85, 0]} scale={0.5} />

      {/* Particle fire effect - positioned to sit inside fire pit */}
      <ParticleFire position={[0, -4.75, 0]} />

      {/* Fire glow - point light for ambient fire glow */}
      <pointLight
        position={[0, -4.7, 0]}
        intensity={1.2}
        distance={7}
        color="#ff6600"
      />

      {/* Spotlight for casting shadows from fire pit */}
      <spotLight
        position={[0, -3.5, 0]}
        target-position={[0, -5, 0]}
        angle={Math.PI / 3}
        penumbra={0.5}
        intensity={0.8}
        distance={5}
        color="#ff6600"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={5}
        shadow-bias={-0.0001}
      />
    </group>
  );
}

// Preload the fire pit model
useGLTF.preload('/models/firepit/stone_fire_pit_4k.glb');

// Firewood Stack - logs stacked beside the house
function FirewoodStack({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/models/log/log1_1.8k.glb');

  // Load log textures
  const [diffuseMap, normalMap, roughnessMap, aoMap] = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();

    const diffuse = textureLoader.load('/models/log/textures/log1_1.8k_u0_v0_diffuse.webp');
    const normal = textureLoader.load('/models/log/textures/log1_1.8k_u0_v0_normal.webp');
    const rough = textureLoader.load('/models/log/textures/log1_1.8k_u0_v0_roughness.webp');
    const ao = textureLoader.load('/models/log/textures/log1_1.8k_u0_v0_ao.webp');

    diffuse.encoding = THREE.sRGBEncoding;

    return [diffuse, normal, rough, ao];
  }, []);

  // Create multiple log instances for the stack
  const logPositions = useMemo(() => [
    // Bottom layer - 3 logs
    { pos: [0, 0, 0], rot: [0, 0, 0] },
    { pos: [0.15, 0, 0.3], rot: [0, 0.3, 0] },
    { pos: [-0.15, 0, -0.3], rot: [0, -0.4, 0] },
    // Middle layer - 2 logs
    { pos: [0, 0.15, 0.15], rot: [0, 1.5, 0] },
    { pos: [0, 0.15, -0.15], rot: [0, 1.8, 0] },
    // Top layer - 2 logs
    { pos: [0, 0.3, 0], rot: [0, 0.2, 0] },
    { pos: [0.1, 0.3, 0.1], rot: [0, -0.5, 0] }
  ], []);

  return (
    <group position={position} rotation={rotation}>
      {logPositions.map((logData, i) => {
        const logModel = useMemo(() => {
          const clone = scene.clone();

          clone.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (child.material) {
                child.material = child.material.clone();
                child.material.map = diffuseMap;
                child.material.normalMap = normalMap;
                child.material.roughnessMap = roughnessMap;
                child.material.aoMap = aoMap;
                child.material.needsUpdate = true;
              }
            }
          });

          return clone;
        }, [scene, diffuseMap, normalMap, roughnessMap, aoMap]);

        return (
          <primitive
            key={i}
            object={logModel}
            position={logData.pos}
            rotation={logData.rot}
            scale={0.00005 * scale}
          />
        );
      })}
    </group>
  );
}

// Preload the log model
useGLTF.preload('/models/log/log1_1.8k.glb');

// Creeper - hidden in the forest
function Creeper({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/models/creeper/Creeper.glb');

  // Load creeper texture
  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load('/models/creeper/creeper.png');
    tex.encoding = THREE.sRGBEncoding;
    return tex;
  }, []);

  // Clone and configure creeper
  const creeperModel = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      }
    });

    return clone;
  }, [scene, texture]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={creeperModel}
        scale={0.8}
      />
    </group>
  );
}

// Preload the creeper model
useGLTF.preload('/models/creeper/Creeper.glb');

// Tree with purple fabric attached - using TreeSet2/PineTree.glb
function Tree({ position, hasFabric = false, scale = 1 }) {
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
        scale={0.65 * scale}
        position={[0, 0, 0]}
      />

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

// Preload the tree model
useGLTF.preload('/models/TreeSet2/PineTree.glb');

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
    if (camera && fov !== undefined && fov !== camera.fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}

// Forest edge - creating atmosphere with 5 trees
// Positioned to avoid house (-8.4, -4.9, -1.4) and campfire (-0.8, -0.1, 2.4)
// One tree positioned near fabric clue (-8.4, -7.7, -2.4)
function ForestEdge() {
  const treePositions = [
    // Tree with fabric - positioned near the fabric clue location
    { pos: [-8.4, -5, -3.5], fabric: true, scale: 1.2 },
    // Background trees - spread around the scene
    { pos: [-12, -5, -8], fabric: false, scale: 1.0 },
    { pos: [-15, -5, -12], fabric: false, scale: 0.9 },
    { pos: [3, -5, -10], fabric: false, scale: 1.1 },
    { pos: [5, -5, -15], fabric: false, scale: 0.8 }
  ];

  return (
    <group>
      {treePositions.map((tree, i) => (
        <Tree
          key={i}
          position={tree.pos}
          hasFabric={tree.fabric}
          scale={tree.scale}
        />
      ))}
    </group>
  );
}

/**
 * Level1Scene3D - The 3D environment for Level 1: Frozen Outpost
 * @param {Object} props
 * @param {Array} props.clues - Array of clue objects from scene data
 * @param {Function} props.onClueClick - Callback when a clue is clicked
 * @param {Function} props.onObjectClick - Callback when a non-clue object is clicked
 */
export default function Level1Scene3D({ clues, onClueClick, onObjectClick }) {
  const [hoveredClue, setHoveredClue] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [devMode] = useState(true); // Set to false in production
  const [cameraInfo, setCameraInfo] = useState({
    position: [3.63, -3.38, 4.44],
    rotation: [0.06, 0.79, -0.04],
    fov: 60
  });
  const [fov, setFov] = useState(60);

  // Dev mode object states
  const [objectStates, setObjectStates] = useState({
    campfire: { position: [-0.80, 0, 3], rotation: [0.00, 0.00, 0.00], scale: 1.00 },
    creeper: { position: [-11.10, -5.10, -15.90], rotation: [0.00, 1.24, 0.00], scale: 1.00 },
    outpost: { position: [-8.40, -4.90, -1.40], rotation: [0.00, 1.48, 0.00], scale: 1.00 },
    firewoodStack: { position: [-6.20, -4.90, 0.80], rotation: [0.38, 0.02, 1.10], scale: 2.00 },
    windowLight1: { position: [-9.50, -3.60, 1.90], rotation: [0, 0, 0], scale: 1 },
    windowLight2: { position: [-6.80, -4.00, -4.60], rotation: [0, 0, 0], scale: 1 },
    fabricClue: { position: [-3.00, -4.60, -7.30], rotation: [-83.00, 1.0, 81.0], scale: 1.00 },
    headphoneClue: { position: [-0.7, -4.98, 0.5], rotation: [0, 0, 0], scale: 1 },
    footprintsClue: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 }
  });

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

  const handleObjectHover = (objectId) => {
    setHoveredObject(objectId);
    document.body.style.cursor = 'pointer';
  };

  const handleObjectUnhover = () => {
    setHoveredObject(null);
    document.body.style.cursor = 'auto';
  };

  // Handle dev control changes
  const handleObjectChange = (objectName, changes) => {
    setObjectStates(prev => ({
      ...prev,
      [objectName]: {
        ...prev[objectName],
        ...changes
      }
    }));
  };

  // Handle FOV change
  const handleFovChange = (newFov) => {
    setFov(newFov);
  };

  // Create dev controls object list
  const devControlObjects = devMode ? [
    {
      name: 'Campfire',
      position: objectStates.campfire.position,
      rotation: objectStates.campfire.rotation,
      scale: objectStates.campfire.scale,
      onChange: (changes) => handleObjectChange('campfire', changes)
    },
    {
      name: 'Creeper',
      position: objectStates.creeper.position,
      rotation: objectStates.creeper.rotation,
      scale: objectStates.creeper.scale,
      onChange: (changes) => handleObjectChange('creeper', changes)
    },
    {
      name: 'Outpost',
      position: objectStates.outpost.position,
      rotation: objectStates.outpost.rotation,
      scale: objectStates.outpost.scale,
      onChange: (changes) => handleObjectChange('outpost', changes)
    },
    {
      name: 'Firewood Stack',
      position: objectStates.firewoodStack.position,
      rotation: objectStates.firewoodStack.rotation,
      scale: objectStates.firewoodStack.scale,
      onChange: (changes) => handleObjectChange('firewoodStack', changes)
    },
    {
      name: 'Window Light 1',
      position: objectStates.windowLight1.position,
      rotation: objectStates.windowLight1.rotation,
      scale: objectStates.windowLight1.scale,
      onChange: (changes) => handleObjectChange('windowLight1', changes)
    },
    {
      name: 'Window Light 2',
      position: objectStates.windowLight2.position,
      rotation: objectStates.windowLight2.rotation,
      scale: objectStates.windowLight2.scale,
      onChange: (changes) => handleObjectChange('windowLight2', changes)
    },
    {
      name: 'Fabric Clue',
      position: objectStates.fabricClue.position,
      rotation: objectStates.fabricClue.rotation,
      scale: objectStates.fabricClue.scale,
      onChange: (changes) => handleObjectChange('fabricClue', changes)
    },
    {
      name: 'Headphone Clue',
      position: objectStates.headphoneClue.position,
      rotation: objectStates.headphoneClue.rotation,
      scale: objectStates.headphoneClue.scale,
      onChange: (changes) => handleObjectChange('headphoneClue', changes)
    }
  ] : [];

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
          objects={devControlObjects}
        />
      )}

      <Canvas
        shadows
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Camera tracking for dev mode */}
          {devMode && <CameraTracker onUpdate={setCameraInfo} fov={fov} />}

          {/* Camera - zoomed in, tilted down 5 degrees */}
          <PerspectiveCamera
            makeDefault
            position={cameraInfo.position}
            rotation={cameraInfo.rotation}
            fov={fov}
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
          <Outpost
            position={objectStates.outpost.position}
            rotation={objectStates.outpost.rotation}
            scale={objectStates.outpost.scale}
          />
          <ForestEdge />
          <Creeper
            position={objectStates.creeper.position}
            rotation={objectStates.creeper.rotation}
            scale={objectStates.creeper.scale}
          />
          <Campfire
            position={objectStates.campfire.position}
            rotation={objectStates.campfire.rotation}
            scale={objectStates.campfire.scale}
          />
          <FirewoodStack
            position={objectStates.firewoodStack.position}
            rotation={objectStates.firewoodStack.rotation}
            scale={objectStates.firewoodStack.scale}
          />

          {/* Window lights - now controllable */}
          <pointLight position={objectStates.windowLight1.position} intensity={0.5} distance={4} color="#ffaa00" />
          <pointLight position={objectStates.windowLight2.position} intensity={0.5} distance={4} color="#ffaa00" />

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
              position={objectStates.fabricClue.position}
              rotation={objectStates.fabricClue.rotation}
              scale={objectStates.fabricClue.scale}
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
              position={objectStates.headphoneClue.position}
              rotation={objectStates.headphoneClue.rotation}
              scale={objectStates.headphoneClue.scale}
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

          {/* Dev mode orbit controls */}
          {devMode && <OrbitControls makeDefault />}
        </Suspense>
      </Canvas>
    </div>
  );
}
