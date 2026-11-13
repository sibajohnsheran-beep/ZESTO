
import {
  Suspense,
  useMemo,
  useRef,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  PresentationControls,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";

// ==========================================
// ZESTO HERO PIZZA 3D MODEL
// ==========================================

const MODEL_PATH = "/models/zesto-hero-pizza.glb";

// ==========================================
// LOAD AND PREPARE THE PIZZA MODEL
// ==========================================

function PizzaModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const { size } = useThree();

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.updateMatrixWorld(true);

    // ======================================
    // REMOVE BLENDER PREVIEW GROUND
    // ======================================

    const objectsToRemove: THREE.Object3D[] = [];

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return;
      }

      const bounds = new THREE.Box3().setFromObject(
        child
      );

      const dimensions = bounds.getSize(
        new THREE.Vector3()
      );

      const largestDimension = Math.max(
        dimensions.x,
        dimensions.y,
        dimensions.z
      );

      const objectName = child.name.toLowerCase();

      const isPreviewGround =
        objectName.includes("preview_only_ground") ||
        objectName.includes("preview_ground");

      const isOversizedMesh =
        largestDimension > 25;

      if (isPreviewGround || isOversizedMesh) {
        objectsToRemove.push(child);
      }
    });

    objectsToRemove.forEach((object) => {
      object.parent?.remove(object);
    });

    // ======================================
    // CALCULATE ACTUAL PIZZA SIZE
    // ======================================

    clone.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(
      clone
    );

    const modelSize = bounds.getSize(
      new THREE.Vector3()
    );

    const modelCenter = bounds.getCenter(
      new THREE.Vector3()
    );

    const largestDimension = Math.max(
      modelSize.x,
      modelSize.y,
      modelSize.z,
      0.001
    );

    const targetSize = 4.8;

    const scale = targetSize / largestDimension;

    clone.scale.setScalar(scale);

    clone.position.set(
      -modelCenter.x * scale,
      -modelCenter.y * scale,
      -modelCenter.z * scale
    );

    // ======================================
    // MESH LIGHTING
    // ======================================

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = false;
      }
    });

    return clone;
  }, [scene]);

  // ========================================
  // RESPONSIVE SCALE
  // ========================================

  const responsiveScale =
    size.width < 480
      ? 0.75
      : size.width < 640
        ? 0.88
        : 1;

  return (
    <group scale={responsiveScale}>
      <primitive object={model} />
    </group>
  );
}

// ==========================================
// CINEMATIC PIZZA ANIMATION
// ==========================================

function AnimatedPizza() {
  const pizzaGroup = useRef<THREE.Group>(null);

  // ========================================
  // AUTOMATIC CONTINUOUS ANIMATION
  // ========================================

  useFrame(({ clock }) => {
    if (!pizzaGroup.current) return;

    const time = clock.getElapsedTime();

    // Smooth floating movement
    pizzaGroup.current.position.y =
      Math.sin(time * 1.1) * 0.15;

    // Subtle horizontal movement
    pizzaGroup.current.position.x =
      Math.sin(time * 0.45) * 0.045;

    // Gentle forward/back tilt
    pizzaGroup.current.rotation.x =
      0.08 + Math.sin(time * 0.55) * 0.055;

    // Visible left/right 3D rotation
    pizzaGroup.current.rotation.y =
      -0.15 + Math.sin(time * 0.48) * 0.22;

    // Small cinematic roll
    pizzaGroup.current.rotation.z =
      Math.sin(time * 0.4) * 0.035;
  });

  return (
    <group ref={pizzaGroup}>

      {/* ==================================
          MOUSE DRAG INTERACTION
      ================================== */}

      <PresentationControls
        global={false}
        rotation={[0, 0, 0]}
        polar={[-0.25, 0.35]}
        azimuth={[-0.55, 0.55]}
        snap
      >
        <PizzaModel />
      </PresentationControls>

    </group>
  );
}

// ==========================================
// LOADING PLACEHOLDER
// ==========================================

function LoadingPizza() {
  return (
    <group>

      {/* CRUST */}

      <mesh>
        <cylinderGeometry
          args={[1.6, 1.6, 0.18, 48]}
        />

        <meshStandardMaterial
          color="#c77731"
          roughness={0.7}
        />
      </mesh>

      {/* CHEESE */}

      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry
          args={[1.45, 1.45, 0.025, 48]}
        />

        <meshStandardMaterial
          color="#efa642"
          roughness={0.5}
        />
      </mesh>

    </group>
  );
}

// ==========================================
// MAIN 3D HERO COMPONENT
// ==========================================

export default function HeroPizza3D() {
  return (
    <div
      className="pizza-canvas"
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
      }}
    >
      <Canvas
        frameloop="always"
        camera={{
          position: [0, 2.7, 7.2],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping:
            THREE.ACESFilmicToneMapping,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          touchAction: "pan-y",
        }}
      >

        {/* ==================================
            AMBIENT LIGHT
        ================================== */}

        <ambientLight intensity={1.25} />

        {/* ==================================
            HEMISPHERE LIGHT
        ================================== */}

        <hemisphereLight
          args={[
            "#fff0d2",
            "#42120a",
            1.25,
          ]}
        />

        {/* ==================================
            MAIN CINEMATIC LIGHT
        ================================== */}

        <directionalLight
          position={[3, 6, 5]}
          intensity={2.8}
          color="#fff0d3"
        />

        {/* ==================================
            WARM FRONT LIGHT
        ================================== */}

        <directionalLight
          position={[-2, 3, 7]}
          intensity={1}
          color="#ffe3bc"
        />

        {/* ==================================
            RED FILL LIGHT
        ================================== */}

        <pointLight
          position={[-4, 2, 3]}
          intensity={18}
          distance={12}
          color="#ff5429"
        />

        {/* ==================================
            GOLDEN RIM LIGHT
        ================================== */}

        <pointLight
          position={[4, 3, -2]}
          intensity={16}
          distance={12}
          color="#ffae59"
        />

        {/* ==================================
            ANIMATED PIZZA
        ================================== */}

        <Suspense fallback={<LoadingPizza />}>
          <AnimatedPizza />
        </Suspense>

      </Canvas>
    </div>
  );
}

// ==========================================
// PRELOAD MODEL
// ==========================================

useGLTF.preload(MODEL_PATH);
