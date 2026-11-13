
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import {
  ArrowRight,
  ChefHat,
  Heart,
  Leaf,
} from "lucide-react";
import * as THREE from "three";

import "./OurStory.css";

type Point3D = [number, number, number];

// ==========================================
// ZESTO CHEF - PREMIUM MATERIAL PALETTE
// ==========================================

const C = {
  skin: "#e8a982",
  skinLight: "#f3c29c",
  skinShadow: "#cb8561",
  cheek: "#e9a18d",
  white: "#fff8ef",
  jacket: "#f0e8df",
  seam: "#d6c9bd",
  red: "#d72c22",
  deepRed: "#902016",
  hair: "#35201a",
  brown: "#704025",
  mouth: "#672922",
  trouser: "#2b211e",
  shoe: "#241813",
  basil: "#377e31",
  tomato: "#e83d29",
  cheese: "#f7d79d",
};

// ==========================================
// REUSABLE MODEL PARTS
// ==========================================

function Oval({
  position,
  scale,
  color,
  rotation = [0, 0, 0],
  roughness = 0.62,
  clearcoat = 0.05,
}: {
  position: Point3D;
  scale: Point3D;
  color: string;
  rotation?: Point3D;
  roughness?: number;
  clearcoat?: number;
}) {
  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow
    >
      <sphereGeometry args={[1, 32, 24]} />

      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.65}
      />
    </mesh>
  );
}

function Curve({
  points,
  color,
  radius = 0.015,
}: {
  points: Point3D[];
  color: string;
  radius?: number;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((point) => new THREE.Vector3(...point))
      ),
    [points]
  );

  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 28, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        roughness={0.65}
      />
    </mesh>
  );
}

function Limb({
  from,
  to,
  radius,
  color,
}: {
  from: Point3D;
  to: Point3D;
  radius: number;
  color: string;
}) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);

  const direction = b.clone().sub(a);
  const length = direction.length();

  const quaternion =
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

  const midpoint = a.clone().add(b).multiplyScalar(0.5);

  return (
    <mesh
      position={midpoint}
      quaternion={quaternion}
      castShadow
    >
      <cylinderGeometry
        args={[radius * 0.88, radius, length, 24]}
      />
      <meshStandardMaterial
        color={color}
        roughness={0.8}
      />
    </mesh>
  );
}

// ==========================================
// PREMIUM CHEF HAT
// ==========================================

function PremiumChefHat() {
  return (
    <group>
      {/* Main hat band */}

      <mesh position={[0, 1.43, 0.08]} castShadow>
        <cylinderGeometry
          args={[0.45, 0.44, 0.35, 48]}
        />
        <meshStandardMaterial
          color={C.white}
          roughness={0.86}
        />
      </mesh>

      {/* Red signature stripe */}

      <mesh position={[0, 1.37, 0.08]}>
        <cylinderGeometry
          args={[0.458, 0.458, 0.085, 48]}
        />
        <meshStandardMaterial
          color={C.red}
          roughness={0.56}
        />
      </mesh>

      {/* Soft puffed fabric crown */}

      <Oval
        position={[0, 1.77, 0.07]}
        scale={[0.48, 0.33, 0.41]}
        color={C.white}
        roughness={0.9}
      />

      {/* Natural cloth folds */}

      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;

        return (
          <Oval
            key={`hat-fold-${index}`}
            position={[
              Math.sin(angle) * 0.37,
              1.80 + Math.cos(angle * 2) * 0.025,
              0.07 + Math.cos(angle) * 0.27,
            ]}
            scale={[0.18, 0.31, 0.20]}
            color={
              index % 2 === 0
                ? C.white
                : C.jacket
            }
            rotation={[
              0,
              0,
              Math.sin(angle) * 0.13,
            ]}
            roughness={0.9}
          />
        );
      })}

      <Oval
        position={[0, 2.01, 0.05]}
        scale={[0.36, 0.11, 0.30]}
        color={C.white}
        roughness={0.9}
      />

      {/* Front fabric seams */}

      {[-0.23, 0, 0.23].map((x) => (
        <Curve
          key={`hat-seam-${x}`}
          points={[
            [x * 0.75, 1.62, 0.42],
            [x, 1.80, 0.44],
            [x * 0.65, 1.97, 0.33],
          ]}
          color="#e8dcd0"
          radius={0.007}
        />
      ))}
    </group>
  );
}

// ==========================================
// FACE - EYES, CHEEKS, NOSE, MOUSTACHE
// ==========================================

function ChefFace() {
  return (
    <group>

      {/* Back hair */}

      <Oval
        position={[0, 0.96, -0.09]}
        scale={[0.54, 0.50, 0.45]}
        color={C.hair}
      />

      {/* Head */}

      <Oval
        position={[0, 0.83, 0.13]}
        scale={[0.51, 0.54, 0.47]}
        color={C.skin}
        roughness={0.55}
      />

      {/* Jaw / lower face */}

      <Oval
        position={[0, 0.54, 0.28]}
        scale={[0.38, 0.23, 0.31]}
        color={C.skin}
        roughness={0.58}
      />

      {[-1, 1].map((side) => (
        <group key={`face-${side}`}>

          {/* Ears */}

          <Oval
            position={[side * 0.51, 0.81, 0.12]}
            scale={[0.11, 0.17, 0.13]}
            color={C.skin}
          />

          {/* Cheeks */}

          <Oval
            position={[side * 0.34, 0.66, 0.43]}
            scale={[0.19, 0.18, 0.135]}
            color={C.skinLight}
          />

          {/* Soft cheek blush */}

          <Oval
            position={[side * 0.35, 0.65, 0.555]}
            scale={[0.11, 0.068, 0.012]}
            color={C.cheek}
            roughness={0.9}
          />

          {/* Eyeball */}

          <Oval
            position={[side * 0.19, 1.00, 0.54]}
            scale={[0.105, 0.11, 0.054]}
            color={C.white}
          />

          {/* Iris */}

          <Oval
            position={[side * 0.177, 0.985, 0.596]}
            scale={[0.049, 0.055, 0.018]}
            color={C.brown}
          />

          {/* Pupil */}

          <Oval
            position={[side * 0.177, 0.986, 0.615]}
            scale={[0.025, 0.032, 0.009]}
            color="#160f0c"
          />

          {/* Eye catchlight */}

          <Oval
            position={[side * 0.16, 1.006, 0.626]}
            scale={[0.012, 0.014, 0.006]}
            color="#ffffff"
          />

          {/* Upper eyelid */}

          <Curve
            points={[
              [side * 0.088, 1.048, 0.553],
              [side * 0.19, 1.090, 0.558],
              [side * 0.285, 1.048, 0.534],
            ]}
            color={C.skinShadow}
            radius={0.019}
          />

          {/* Expressive eyebrows */}

          <Curve
            points={[
              [side * 0.09, 1.16, 0.51],
              [side * 0.19, 1.20, 0.51],
              [side * 0.31, 1.155, 0.45],
            ]}
            color={C.hair}
            radius={0.037}
          />

          {/* Smile dimple */}

          <Oval
            position={[side * 0.255, 0.51, 0.555]}
            scale={[0.024, 0.015, 0.008]}
            color={C.skinShadow}
          />

        </group>
      ))}

      {/* Nose bridge */}

      <Oval
        position={[0, 0.89, 0.565]}
        scale={[0.075, 0.15, 0.09]}
        color={C.skinLight}
      />

      {/* Rounded nose */}

      <Oval
        position={[0, 0.78, 0.638]}
        scale={[0.14, 0.105, 0.115]}
        color={C.skinLight}
        roughness={0.53}
      />

      {/* Smile */}

      <Oval
        position={[0, 0.49, 0.55]}
        scale={[0.23, 0.10, 0.045]}
        color={C.mouth}
      />

      {/* Teeth */}

      <Oval
        position={[0, 0.525, 0.591]}
        scale={[0.18, 0.039, 0.017]}
        color="#fff6e8"
      />

      {/* Lower lip */}

      <Curve
        points={[
          [-0.17, 0.445, 0.578],
          [0, 0.414, 0.585],
          [0.17, 0.445, 0.578],
        ]}
        color="#bc765e"
        radius={0.012}
      />

      {/* Curved Italian moustache */}

      {[-1, 1].map((side) => (
        <group key={`moustache-${side}`}>

          <Oval
            position={[side * 0.13, 0.645, 0.584]}
            scale={[0.18, 0.072, 0.073]}
            rotation={[0, 0, -side * 0.13]}
            color={C.hair}
          />

          <Curve
            points={[
              [side * 0.14, 0.65, 0.624],
              [side * 0.26, 0.63, 0.602],
              [side * 0.35, 0.66, 0.548],
              [side * 0.40, 0.735, 0.49],
            ]}
            color={C.hair}
            radius={0.044}
          />

          {/* Fine moustache highlight */}

          <Curve
            points={[
              [side * 0.13, 0.673, 0.641],
              [side * 0.24, 0.655, 0.619],
              [side * 0.33, 0.682, 0.556],
            ]}
            color="#59372c"
            radius={0.009}
          />

        </group>
      ))}

      <PremiumChefHat />
    </group>
  );
}

// ==========================================
// CHEF BODY AND UNIFORM
// ==========================================

function ChefBody() {
  return (
    <group>

      {/* Trousers and shoes */}

      {[-0.32, 0.32].map((x) => (
        <group key={`leg-${x}`}>
          <Oval
            position={[x, -1.77, 0]}
            scale={[0.26, 0.66, 0.26]}
            color={C.trouser}
            roughness={0.88}
          />

          <Oval
            position={[x, -2.32, 0.19]}
            scale={[0.32, 0.17, 0.46]}
            color={C.shoe}
            roughness={0.36}
            clearcoat={0.2}
          />

          {/* Shoe detailing */}

          <Curve
            points={[
              [x - 0.18, -2.25, 0.52],
              [x, -2.23, 0.55],
              [x + 0.18, -2.25, 0.52],
            ]}
            color="#6a4535"
            radius={0.013}
          />
        </group>
      ))}

      {/* Main chef jacket */}

      <Oval
        position={[0, -0.55, 0]}
        scale={[0.81, 0.93, 0.49]}
        color={C.jacket}
        roughness={0.86}
      />

      {/* Front white fabric */}

      <Oval
        position={[0, -0.49, 0.17]}
        scale={[0.74, 0.86, 0.39]}
        color={C.white}
        roughness={0.86}
      />

      {/* Jacket center seam */}

      <Curve
        points={[
          [0, 0.04, 0.55],
          [0, -0.35, 0.58],
          [0, -0.80, 0.56],
          [0, -1.04, 0.48],
        ]}
        color={C.seam}
        radius={0.012}
      />

      {/* Subtle jacket folds */}

      {[-1, 1].map((side) => (
        <group key={`folds-${side}`}>
          <Curve
            points={[
              [side * 0.48, -0.30, 0.43],
              [side * 0.56, -0.47, 0.38],
              [side * 0.50, -0.62, 0.39],
            ]}
            color="#e5d8cc"
            radius={0.012}
          />

          <Curve
            points={[
              [side * 0.40, -0.83, 0.44],
              [side * 0.49, -0.95, 0.37],
              [side * 0.46, -1.04, 0.33],
            ]}
            color="#e5d8cc"
            radius={0.010}
          />
        </group>
      ))}

      {/* Neck */}

      <mesh position={[0, 0.34, 0.09]}>
        <cylinderGeometry
          args={[0.23, 0.27, 0.32, 32]}
        />
        <meshStandardMaterial
          color={C.skin}
          roughness={0.59}
        />
      </mesh>

      {/* Neck scarf */}

      <Oval
        position={[0, 0.19, 0.41]}
        scale={[0.35, 0.11, 0.15]}
        color={C.red}
      />

      <Oval
        position={[0, 0.16, 0.54]}
        scale={[0.12, 0.11, 0.07]}
        color={C.deepRed}
      />

      <Oval
        position={[-0.12, -0.02, 0.50]}
        scale={[0.11, 0.20, 0.034]}
        rotation={[0, 0, 0.36]}
        color={C.red}
      />

      <Oval
        position={[0.12, -0.02, 0.50]}
        scale={[0.11, 0.20, 0.034]}
        rotation={[0, 0, -0.36]}
        color={C.red}
      />

      {/* Double-breasted red buttons */}

      {[-0.23, 0.23].flatMap((x) =>
        [-0.25, -0.53, -0.81].map((y) => (
          <Oval
            key={`button-${x}-${y}`}
            position={[
              x,
              y,
              0.54 - Math.abs(y) * 0.055,
            ]}
            scale={[0.061, 0.061, 0.027]}
            color={C.red}
            roughness={0.34}
            clearcoat={0.28}
          />
        ))
      )}

      {/* Apron */}

      <Oval
        position={[0, -1.21, 0.35]}
        scale={[0.67, 0.39, 0.22]}
        color={C.red}
        roughness={0.78}
      />

      {/* Apron fabric trim */}

      <Curve
        points={[
          [-0.59, -1.46, 0.37],
          [-0.30, -1.52, 0.51],
          [0, -1.53, 0.57],
          [0.30, -1.52, 0.51],
          [0.59, -1.46, 0.37],
        ]}
        color={C.deepRed}
        radius={0.022}
      />

      {/* Apron waist details */}

      <Curve
        points={[
          [-0.62, -1.01, 0.27],
          [-0.33, -1.04, 0.49],
          [0, -1.05, 0.54],
          [0.33, -1.04, 0.49],
          [0.62, -1.01, 0.27],
        ]}
        color="#a31e18"
        radius={0.020}
      />

      {/* Shoulder forms */}

      <Oval
        position={[-0.68, -0.16, 0.02]}
        scale={[0.29, 0.30, 0.28]}
        color={C.white}
      />

      <Oval
        position={[0.68, -0.16, 0.02]}
        scale={[0.29, 0.30, 0.28]}
        color={C.white}
      />

      {/* Left raised arm */}

      <Limb
        from={[-0.72, -0.17, 0.04]}
        to={[-1.03, 0.13, 0.20]}
        radius={0.22}
        color={C.jacket}
      />

      <Limb
        from={[-1.03, 0.13, 0.20]}
        to={[-1.12, 0.73, 0.36]}
        radius={0.165}
        color={C.white}
      />

      {/* Left cuff */}

      <Oval
        position={[-1.12, 0.72, 0.36]}
        scale={[0.18, 0.12, 0.18]}
        color={C.white}
      />

      {/* Right arm resting on hip */}

      <Limb
        from={[0.73, -0.17, 0.02]}
        to={[1.07, -0.54, 0.18]}
        radius={0.22}
        color={C.jacket}
      />

      <Limb
        from={[1.07, -0.54, 0.18]}
        to={[0.83, -1.00, 0.41]}
        radius={0.17}
        color={C.white}
      />

      <Oval
        position={[0.83, -0.99, 0.41]}
        scale={[0.21, 0.13, 0.17]}
        color={C.white}
      />

      <Oval
        position={[0.84, -1.05, 0.52]}
        scale={[0.18, 0.20, 0.13]}
        color={C.skin}
      />
    </group>
  );
}

// ==========================================
// REFINED OK HAND GESTURE
// ==========================================

function OKHand() {
  return (
    <group>

      {/* Palm */}

      <Oval
        position={[-1.12, 0.91, 0.39]}
        scale={[0.155, 0.20, 0.09]}
        color={C.skin}
        roughness={0.56}
      />

      {/* Thumb and index finger circle */}

      <mesh
        position={[-0.96, 1.22, 0.51]}
        rotation={[0, 0, 0.12]}
      >
        <torusGeometry args={[0.10, 0.034, 12, 40]} />
        <meshStandardMaterial
          color={C.skinLight}
          roughness={0.53}
        />
      </mesh>

      {/* Finger connecting to circle */}

      <Curve
        points={[
          [-1.05, 0.99, 0.48],
          [-0.96, 1.10, 0.52],
          [-0.91, 1.16, 0.52],
        ]}
        color={C.skin}
        radius={0.042}
      />

      {/* Raised three fingers */}

      <Curve
        points={[
          [-1.22, 1.02, 0.46],
          [-1.35, 1.19, 0.47],
          [-1.40, 1.39, 0.48],
        ]}
        color={C.skin}
        radius={0.041}
      />

      <Curve
        points={[
          [-1.14, 1.06, 0.47],
          [-1.20, 1.28, 0.48],
          [-1.22, 1.46, 0.49],
        ]}
        color={C.skin}
        radius={0.039}
      />

      <Curve
        points={[
          [-1.06, 1.04, 0.48],
          [-1.03, 1.24, 0.49],
          [-1.05, 1.42, 0.49],
        ]}
        color={C.skin}
        radius={0.036}
      />

      {/* Fingertips */}

      {[
        [-1.40, 1.39, 0.48],
        [-1.22, 1.46, 0.49],
        [-1.05, 1.42, 0.49],
      ].map((point, i) => (
        <Oval
          key={`fingertip-${i}`}
          position={point as Point3D}
          scale={[0.041, 0.049, 0.041]}
          color={C.skinLight}
        />
      ))}

    </group>
  );
}

// ==========================================
// COMPLETE 3D CHEF WITH ANIMATION
// ==========================================

function ChefCharacter3D() {
  const chefRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (chefRef.current) {
      chefRef.current.position.y =
        Math.sin(time * 0.95) * 0.055;

      chefRef.current.rotation.y =
        THREE.MathUtils.damp(
          chefRef.current.rotation.y,
          Math.sin(time * 0.35) * 0.075 +
            state.pointer.x * 0.10,
          2.2,
          delta
        );
    }

    if (headRef.current) {
      headRef.current.rotation.z =
        Math.sin(time * 0.8) * 0.022;

      headRef.current.rotation.y =
        Math.sin(time * 0.48) * 0.055;
    }

    if (handRef.current) {
      handRef.current.rotation.z =
        Math.sin(time * 1.5) * 0.045;
    }
  });

  return (
    <group ref={chefRef} scale={0.96}>
      <ChefBody />

      {/* Head pivot for subtle nodding */}

      <group ref={headRef} position={[0, 0.63, 0]}>
        <group position={[0, -0.63, 0]}>
          <ChefFace />
        </group>
      </group>

      {/* Small hand movement */}

      <group
        ref={handRef}
        position={[-1.12, 0.73, 0.36]}
      >
        <group position={[1.12, -0.73, -0.36]}>
          <OKHand />
        </group>
      </group>
    </group>
  );
}

// ==========================================
// FLOATING TOMATO SLICES
// ==========================================

function FloatingTomato({
  position,
  scale = 1,
}: {
  position: Point3D;
  scale?: number;
}) {
  return (
    <Float
      speed={1.4}
      floatIntensity={0.36}
      rotationIntensity={0.24}
    >
      <group position={position} scale={scale}>

        {/* Tomato outer skin */}

        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry
            args={[0.33, 0.33, 0.11, 40]}
          />
          <meshPhysicalMaterial
            color={C.tomato}
            roughness={0.38}
            clearcoat={0.2}
          />
        </mesh>

        {/* Tomato cut surface */}

        <mesh position={[0, 0, 0.064]}>
          <circleGeometry args={[0.275, 40]} />
          <meshStandardMaterial
            color="#f18a6d"
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Seed details */}

        {Array.from({ length: 7 }, (_, i) => {
          const angle = (i / 7) * Math.PI * 2;

          return (
            <Oval
              key={`seed-${i}`}
              position={[
                Math.cos(angle) * 0.17,
                Math.sin(angle) * 0.17,
                0.077,
              ]}
              scale={[0.028, 0.046, 0.009]}
              rotation={[0, 0, angle]}
              color="#ffdda3"
            />
          );
        })}
      </group>
    </Float>
  );
}

// ==========================================
// FLOATING BASIL
// ==========================================

function FloatingBasil({
  position,
  rotation = 0,
}: {
  position: Point3D;
  rotation?: number;
}) {
  return (
    <Float
      speed={1.7}
      floatIntensity={0.38}
      rotationIntensity={0.28}
    >
      <group
        position={position}
        rotation={[0, 0, rotation]}
      >
        <Oval
          position={[0, 0, 0]}
          scale={[0.19, 0.36, 0.045]}
          color={C.basil}
          roughness={0.54}
        />

        {/* Leaf vein */}

        <Curve
          points={[
            [0, -0.29, 0.047],
            [0, 0, 0.054],
            [0, 0.29, 0.047],
          ]}
          color="#add274"
          radius={0.009}
        />
      </group>
    </Float>
  );
}

// ==========================================
// FLOATING CHEESE
// ==========================================

function FloatingCheese({
  position,
}: {
  position: Point3D;
}) {
  return (
    <Float
      speed={1.3}
      floatIntensity={0.3}
      rotationIntensity={0.45}
    >
      <group
        position={position}
        rotation={[0.32, 0.35, 0.35]}
      >
        <mesh castShadow>
          <boxGeometry args={[0.32, 0.29, 0.28]} />
          <meshStandardMaterial
            color={C.cheese}
            roughness={0.7}
          />
        </mesh>

        {/* Cheese pores */}

        <Oval
          position={[0.07, 0.05, 0.143]}
          scale={[0.033, 0.023, 0.009]}
          color="#e4ba73"
        />

        <Oval
          position={[-0.065, -0.06, 0.143]}
          scale={[0.025, 0.019, 0.009]}
          color="#e4ba73"
        />
      </group>
    </Float>
  );
}

// ==========================================
// PREMIUM GLOWING RING
// ==========================================

function GlowingRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;

    ringRef.current.rotation.z =
      Math.sin(state.clock.elapsedTime * 0.28) * 0.05;
  });

  return (
    <group position={[0, -0.14, -1.12]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.20, 0.024, 12, 128]} />
        <meshStandardMaterial
          color="#ff9957"
          emissive="#e94b26"
          emissiveIntensity={1.45}
          toneMapped={false}
        />
      </mesh>

      <mesh>
        <torusGeometry args={[2.32, 0.009, 8, 128]} />
        <meshBasicMaterial
          color="#bf2a1e"
          transparent
          opacity={0.48}
        />
      </mesh>
    </group>
  );
}

// ==========================================
// COMPLETE CINEMATIC 3D SCENE
// ==========================================

function ChefScene3D() {
  return (
    <div className="zesto-story-canvas">
      <Canvas
        camera={{
          position: [0, 0.05, 8.2],
          fov: 39,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance",
        }}
        style={{
          background: "transparent",
          touchAction: "pan-y",
        }}
      >

        {/* Soft global lighting */}

        <ambientLight intensity={0.9} />

        <hemisphereLight
          args={["#fff1df", "#502019", 1.15]}
        />

        {/* Main warm studio light */}

        <directionalLight
          position={[-3, 5, 6]}
          intensity={2.6}
          color="#fff0dc"
        />

        {/* Face fill light */}

        <directionalLight
          position={[3, 2, 5]}
          intensity={1}
          color="#ffe8ca"
        />

        {/* Red cinematic light */}

        <pointLight
          position={[-3, 2, 3]}
          intensity={12}
          distance={9}
          color="#ff6339"
        />

        {/* Golden rim light */}

        <pointLight
          position={[3, 3, -2]}
          intensity={14}
          distance={10}
          color="#ffb86c"
        />

        <GlowingRing />

        <ChefCharacter3D />

        <FloatingTomato
          position={[-2.27, 1.12, 0.35]}
          scale={0.83}
        />

        <FloatingTomato
          position={[2.30, -0.95, 0.5]}
          scale={0.67}
        />

        <FloatingBasil
          position={[2.19, 1.26, 0.6]}
          rotation={-0.5}
        />

        <FloatingBasil
          position={[-2.30, -0.95, 0.7]}
          rotation={0.5}
        />

        <FloatingCheese
          position={[2.04, 0.22, 0.3]}
        />

        {/* Cinematic particles */}

        <Sparkles
          count={24}
          scale={[5.8, 5, 2]}
          size={2}
          speed={0.18}
          color="#ff9d5b"
          opacity={0.55}
        />

      </Canvas>
    </div>
  );
}

// ==========================================
// STORY FEATURES
// ==========================================

const storyFeatures = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Handpicked & high quality",
  },
  {
    icon: ChefHat,
    title: "Authentic Recipes",
    description: "Traditional Italian taste",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "For pizza lovers, always",
  },
];

// ==========================================
// OUR STORY MAIN SECTION
// ==========================================

export default function OurStory() {
  return (
    <section className="zesto-story" id="about">
      <div className="zesto-story-inner">

        {/* LEFT - PREMIUM 3D CHEF */}

        <div className="zesto-story-visual">
          <div className="zesto-story-halo" />

          <ChefScene3D />

          <div className="zesto-story-visual-tag">
            PASSION IN EVERY SLICE
          </div>
        </div>

        {/* RIGHT - ORIGINAL STORY CONTENT */}

        <div className="zesto-story-content">
          <div className="zesto-story-eyebrow">
            <span />
            OUR STORY
            <span />
          </div>

          <h2 className="zesto-story-heading">
            The Story Behind
            <em> ZESTO</em>
          </h2>

          <p className="zesto-story-description">
            Born from a passion for authentic Italian
            pizza, ZESTO was created to bring people
            together over fresh, flavorful, and
            perfectly baked pizzas.
            <br />
            <br />
            We use quality ingredients, time-honored
            recipes, and a whole lot of love in
            every slice.
          </p>

          <div className="zesto-story-features">
            {storyFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  className="zesto-story-feature"
                  key={feature.title}
                >
                  <div className="zesto-story-feature-icon">
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href="#menu"
            className="zesto-story-button"
          >
            Explore Our Pizzas
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
