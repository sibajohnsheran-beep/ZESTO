
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import {
  ArrowRight,
  ChefHat,
  Flame,
  Leaf,
} from "lucide-react";
import * as THREE from "three";

import "./FreshIngredients.css";

type Vec3 = [number, number, number];

// ==========================================
// ZESTO - PREMIUM 3D INGREDIENTS
// ==========================================

const COLORS = {
  tomato: "#e83a25",
  tomatoLight: "#ff6842",
  tomatoInside: "#f88b64",
  tomatoGel: "#ffb06b",
  tomatoSeed: "#ffe8ae",
  basil: "#267b30",
  basilLight: "#76b94b",
  basilVein: "#b2d67b",
  pepperoni: "#a9281b",
  pepperoniInside: "#d14729",
  pepperoniDark: "#672018",
  pepperoniFat: "#f39a60",
  mozzarella: "#fff0d2",
  mozzarellaLight: "#fff8e5",
  mushroom: "#ac754b",
  mushroomLight: "#d69a61",
  mushroomInside: "#ead6b5",
};

function Oval({
  position,
  scale,
  color,
  rotation = [0, 0, 0],
  roughness = 0.55,
  clearcoat = 0,
}: {
  position: Vec3;
  scale: Vec3;
  color: string;
  rotation?: Vec3;
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
      <sphereGeometry args={[1, 24, 16]} />
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        clearcoat={clearcoat}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}

function CurvedDetail({
  points,
  color,
  radius = 0.01,
}: {
  points: Vec3[];
  color: string;
  radius?: number;
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p))
      ),
    [points]
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 18, radius, 6, false]} />
      <meshStandardMaterial
        color={color}
        roughness={0.62}
      />
    </mesh>
  );
}

// ==========================================
// 01 - WHOLE FRESH TOMATO
// ==========================================

function Tomato3D({
  position,
  scale = 1,
}: {
  position: Vec3;
  scale?: number;
}) {
  return (
    <Float
      speed={1.18}
      floatIntensity={0.27}
      rotationIntensity={0.12}
      floatingRange={[-0.08, 0.08]}
    >
      <group position={position} scale={scale}>
        {/* Natural rounded body */}

        <Oval
          position={[0, 0, 0]}
          scale={[0.53, 0.51, 0.50]}
          color={COLORS.tomato}
          roughness={0.28}
          clearcoat={0.45}
        />

        {/* Subtle skin color variations */}

        {[
          [-0.22, 0.17, 0.41],
          [0.18, -0.19, 0.45],
          [0.32, 0.04, 0.36],
        ].map((p, i) => (
          <Oval
            key={i}
            position={p as Vec3}
            scale={[0.09, 0.055, 0.014]}
            color={COLORS.tomatoLight}
            roughness={0.42}
          />
        ))}

        {/* Green stem */}

        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry
            args={[0.035, 0.05, 0.23, 12]}
          />
          <meshStandardMaterial
            color="#356b24"
            roughness={0.76}
          />
        </mesh>

        {/* Tomato sepals */}

        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2;

          return (
            <Oval
              key={`sepal-${i}`}
              position={[
                Math.cos(angle) * 0.19,
                0.47,
                Math.sin(angle) * 0.19,
              ]}
              scale={[0.22, 0.035, 0.08]}
              rotation={[0, -angle, 0]}
              color="#357b29"
              roughness={0.66}
            />
          );
        })}

        {/* Small surface highlight */}

        <Oval
          position={[-0.19, 0.21, 0.45]}
          scale={[0.095, 0.14, 0.009]}
          color="#ff9e75"
          rotation={[0, 0, -0.3]}
          roughness={0.12}
        />
      </group>
    </Float>
  );
}

// ==========================================
// 02 - REALISTIC TOMATO SLICE
// ==========================================

function TomatoSlice3D({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
}) {
  return (
    <Float
      speed={1.36}
      floatIntensity={0.24}
      rotationIntensity={0.16}
      floatingRange={[-0.05, 0.05]}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Thick red outer skin */}

        <mesh castShadow>
          <cylinderGeometry args={[0.51, 0.51, 0.105, 64]} />
          <meshPhysicalMaterial
            color="#d52c1e"
            roughness={0.33}
            clearcoat={0.28}
          />
        </mesh>

        {/* Face oriented towards camera */}

        <mesh
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 0, 0.058]}
        >
          <circleGeometry args={[0.465, 64]} />
          <meshPhysicalMaterial
            color={COLORS.tomatoInside}
            roughness={0.36}
            clearcoat={0.22}
          />
        </mesh>

        {/* Juicy seed chambers */}

        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;

          return (
            <group key={`chamber-${i}`}>
              <Oval
                position={[
                  Math.cos(a) * 0.27,
                  Math.sin(a) * 0.27,
                  0.07,
                ]}
                scale={[0.155, 0.105, 0.012]}
                rotation={[0, 0, a]}
                color={
                  i % 2
                    ? COLORS.tomatoGel
                    : "#f2a15d"
                }
                roughness={0.28}
              />

              <Oval
                position={[
                  Math.cos(a + 0.10) * 0.28,
                  Math.sin(a + 0.10) * 0.28,
                  0.088,
                ]}
                scale={[0.035, 0.025, 0.008]}
                rotation={[0, 0, a]}
                color={COLORS.tomatoSeed}
              />

              <Oval
                position={[
                  Math.cos(a - 0.10) * 0.32,
                  Math.sin(a - 0.10) * 0.32,
                  0.088,
                ]}
                scale={[0.029, 0.020, 0.008]}
                color={COLORS.tomatoSeed}
              />
            </group>
          );
        })}

        <Oval
          position={[0, 0, 0.078]}
          scale={[0.10, 0.10, 0.018]}
          color="#f6c18d"
        />

        {/* Skin rim */}

        <mesh position={[0, 0, 0.07]}>
          <torusGeometry args={[0.455, 0.025, 8, 64]} />
          <meshStandardMaterial
            color="#b92b1c"
            roughness={0.46}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ==========================================
// 03 - NATURAL BASIL LEAF GEOMETRY
// ==========================================

function BasilLeaf3D({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
}) {
  const leafGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    const vertices: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];

    const rows = 18;
    const columns = 8;

    for (let y = 0; y <= rows; y++) {
      const t = y / rows;

      const width =
        Math.pow(Math.sin(Math.PI * t), 0.85) *
        (0.33 + t * 0.05);

      for (let x = 0; x <= columns; x++) {
        const across = (x / columns) * 2 - 1;

        const px = width * across;
        const py = -0.56 + t * 1.12;

        const pz =
          0.04 * Math.sin(Math.PI * t) +
          0.06 * (1 - across * across) +
          0.025 * Math.sin(t * Math.PI * 3) * across;

        vertices.push(px, py, pz);

        const shade =
          0.84 +
          (1 - Math.abs(across)) * 0.2 +
          0.06 * Math.sin(t * Math.PI * 4);

        const green = new THREE.Color(
          across > 0.3 ? "#2b7c35" : "#419946"
        );

        green.multiplyScalar(shade);

        colors.push(green.r, green.g, green.b);
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const a = y * (columns + 1) + x;
        const b = a + columns + 1;

        indices.push(a, b, a + 1);
        indices.push(a + 1, b, b + 1);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  return (
    <Float
      speed={1.45}
      floatIntensity={0.25}
      rotationIntensity={0.18}
      floatingRange={[-0.07, 0.07]}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <mesh geometry={leafGeometry} castShadow>
          <meshPhysicalMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.48}
            clearcoat={0.10}
          />
        </mesh>

        {/* Central leaf vein */}

        <CurvedDetail
          points={[
            [0, -0.47, 0.03],
            [0, -0.18, 0.075],
            [0, 0.18, 0.09],
            [0, 0.47, 0.04],
          ]}
          color={COLORS.basilVein}
          radius={0.009}
        />

        {/* Small side veins */}

        {[-1, 1].flatMap((side) =>
          [-0.18, 0.05, 0.26].map((y, index) => (
            <CurvedDetail
              key={`${side}-${index}`}
              points={[
                [0, y, 0.095],
                [side * 0.12, y + 0.10, 0.082],
                [side * 0.22, y + 0.16, 0.035],
              ]}
              color="#77bc66"
              radius={0.005}
            />
          ))
        )}

        {/* Small stem */}

        <CurvedDetail
          points={[
            [0, -0.64, 0.02],
            [0, -0.47, 0.03],
          ]}
          color="#377c2e"
          radius={0.018}
        />
      </group>
    </Float>
  );
}

// ==========================================
// 04 - PEPPERONI WITH BAKED DETAILS
// ==========================================

function Pepperoni3D({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: Vec3;
  rotation?: Vec3;
  scale?: number;
}) {
  return (
    <Float
      speed={1.28}
      floatIntensity={0.22}
      rotationIntensity={0.20}
      floatingRange={[-0.06, 0.06]}
    >
      <group
        position={position}
        rotation={rotation}
        scale={scale}
      >
        {/* Sausage body */}

        <mesh castShadow>
          <cylinderGeometry args={[0.47, 0.45, 0.075, 64]} />
          <meshPhysicalMaterial
            color={COLORS.pepperoni}
            roughness={0.39}
            clearcoat={0.18}
          />
        </mesh>

        {/* Main upper surface */}

        <mesh position={[0, 0, 0.048]}>
          <circleGeometry args={[0.425, 64]} />
          <meshStandardMaterial
            color={COLORS.pepperoniInside}
            roughness={0.48}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Roasted curled edge */}

        <mesh position={[0, 0, 0.056]}>
          <torusGeometry args={[0.432, 0.035, 10, 64]} />
          <meshStandardMaterial
            color={COLORS.pepperoniDark}
            roughness={0.61}
          />
        </mesh>

        {/* Marbling, fat and char spots */}

        {Array.from({ length: 20 }, (_, i) => {
          const angle = i * 2.39996;
          const distance = 0.06 + (i % 5) * 0.068;

          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          return (
            <Oval
              key={i}
              position={[x, y, 0.059]}
              scale={[
                i % 4 === 0 ? 0.032 : 0.022,
                i % 3 === 0 ? 0.039 : 0.026,
                0.009,
              ]}
              rotation={[0, 0, angle]}
              color={
                i % 5 === 0
                  ? COLORS.pepperoniDark
                  : COLORS.pepperoniFat
              }
              roughness={i % 5 === 0 ? 0.72 : 0.3}
            />
          );
        })}
      </group>
    </Float>
  );
}

// ==========================================
// 05 - SOFT MOZZARELLA + CHEESE SHREDS
// ==========================================

function Mozzarella3D({
  position,
}: {
  position: Vec3;
}) {
  const pieces: {
    position: Vec3;
    scale: Vec3;
    rotation: Vec3;
  }[] = [
    {
      position: [-0.30, -0.04, 0],
      scale: [0.38, 0.30, 0.34],
      rotation: [0.12, 0.18, -0.2],
    },
    {
      position: [0.19, 0.15, 0.10],
      scale: [0.36, 0.31, 0.35],
      rotation: [-0.1, 0.2, 0.25],
    },
    {
      position: [0.10, -0.24, 0.16],
      scale: [0.40, 0.28, 0.30],
      rotation: [0.2, -0.1, -0.1],
    },
  ];

  return (
    <Float
      speed={1.05}
      floatIntensity={0.23}
      rotationIntensity={0.10}
      floatingRange={[-0.05, 0.05]}
    >
      <group position={position}>
        {pieces.map((piece, i) => (
          <Oval
            key={`cheese-${i}`}
            position={piece.position}
            scale={piece.scale}
            rotation={piece.rotation}
            color={
              i === 1
                ? COLORS.mozzarellaLight
                : COLORS.mozzarella
            }
            roughness={0.48}
            clearcoat={0.08}
          />
        ))}

        {/* Irregular mozzarella strings */}

        {Array.from({ length: 13 }, (_, i) => {
          const x = -0.52 + (i % 7) * 0.17;
          const y = -0.36 + Math.floor(i / 7) * 0.30;
          const z = 0.34 + (i % 3) * 0.035;

          return (
            <CurvedDetail
              key={`shred-${i}`}
              points={[
                [x, y, z],
                [x + 0.09, y + 0.045, z + 0.035],
                [x + 0.25, y - 0.025, z - 0.01],
              ]}
              color={
                i % 3 === 0
                  ? "#f7d9a2"
                  : "#fff4db"
              }
              radius={0.019 + (i % 3) * 0.004}
            />
          );
        })}

        {/* Small moist surface details */}

        {Array.from({ length: 7 }, (_, i) => (
          <Oval
            key={`cheese-gloss-${i}`}
            position={[
              -0.31 + (i % 4) * 0.18,
              -0.13 + Math.floor(i / 4) * 0.24,
              0.33,
            ]}
            scale={[0.055, 0.025, 0.009]}
            color="#fff9e9"
            roughness={0.24}
          />
        ))}
      </group>
    </Float>
  );
}

// ==========================================
// 06 - NATURAL MUSHROOM
// ==========================================

function Mushroom3D({
  position,
  scale = 1,
}: {
  position: Vec3;
  scale?: number;
}) {
  return (
    <Float
      speed={1.12}
      floatIntensity={0.25}
      rotationIntensity={0.12}
      floatingRange={[-0.07, 0.07]}
    >
      <group position={position} scale={scale}>
        {/* Mushroom stem */}

        <mesh
          position={[0, -0.22, 0]}
          rotation={[0, 0, -0.055]}
          castShadow
        >
          <cylinderGeometry
            args={[0.13, 0.18, 0.72, 28]}
          />
          <meshStandardMaterial
            color={COLORS.mushroomInside}
            roughness={0.85}
          />
        </mesh>

        {/* Stem base */}

        <Oval
          position={[0, -0.54, 0]}
          scale={[0.20, 0.09, 0.18]}
          color="#ead3ad"
        />

        {/* Gills / underside */}

        <Oval
          position={[0, 0.06, 0]}
          scale={[0.48, 0.11, 0.44]}
          color="#c9aa82"
          roughness={0.87}
        />

        {/* Rounded mushroom cap */}

        <Oval
          position={[0, 0.22, 0]}
          scale={[0.57, 0.31, 0.52]}
          color={COLORS.mushroom}
          roughness={0.76}
        />

        {/* Softer warm cap highlight */}

        <Oval
          position={[-0.13, 0.39, 0.23]}
          scale={[0.22, 0.08, 0.15]}
          color={COLORS.mushroomLight}
          roughness={0.91}
        />

        {/* Subtle cap spots */}

        {[
          [-0.27, 0.36, 0.18],
          [0.20, 0.42, 0.13],
          [0.04, 0.49, -0.06],
        ].map((p, i) => (
          <Oval
            key={i}
            position={p as Vec3}
            scale={[0.046, 0.014, 0.032]}
            color="#c38b5b"
            roughness={0.95}
          />
        ))}
      </group>
    </Float>
  );
}

// ==========================================
// 07 - CINEMATIC ORBITAL RINGS
// ==========================================

function IngredientRings() {
  const outerRing = useRef<THREE.Mesh>(null);
  const innerRing = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (outerRing.current) {
      outerRing.current.rotation.z = time * 0.018;
    }

    if (innerRing.current) {
      innerRing.current.rotation.z = -time * 0.028;
    }
  });

  return (
    <group position={[0, 0, -1.1]}>
      <mesh
        ref={outerRing}
        rotation={[0.12, 0.05, 0]}
      >
        <torusGeometry args={[2.45, 0.017, 10, 128]} />
        <meshStandardMaterial
          color="#ff9859"
          emissive="#de5e2a"
          emissiveIntensity={1.3}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={innerRing}
        rotation={[-0.12, 0.03, 0]}
      >
        <torusGeometry args={[1.86, 0.009, 8, 120]} />
        <meshBasicMaterial
          color="#f5a05a"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// ==========================================
// 08 - INTERACTIVE INGREDIENT ARRANGEMENT
// ==========================================

function IngredientArrangement() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;

    const targetY =
      state.pointer.x * 0.10 +
      Math.sin(time * 0.35) * 0.06;

    const targetX =
      -state.pointer.y * 0.055 +
      Math.sin(time * 0.40) * 0.025;

    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      targetY,
      2,
      delta
    );

    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      targetX,
      2,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      <IngredientRings />

      {/* Left: whole tomatoes */}

      <Tomato3D
        position={[-1.58, 0.88, 0.35]}
        scale={0.83}
      />

      <Tomato3D
        position={[-1.90, -1.10, 0.1]}
        scale={0.48}
      />

      {/* Center: juicy tomato slice */}

      <TomatoSlice3D
        position={[0.24, 0.90, 0.75]}
        rotation={[0.04, -0.16, 0.17]}
        scale={1.18}
      />

      {/* Right: pepperoni */}

      <Pepperoni3D
        position={[1.82, -0.15, 0.35]}
        rotation={[0.12, -0.18, -0.35]}
        scale={0.75}
      />

      {/* Fresh basil leaves */}

      <BasilLeaf3D
        position={[1.82, 1.08, 0.45]}
        rotation={[0.16, -0.1, -0.48]}
        scale={1.08}
      />

      <BasilLeaf3D
        position={[-0.40, 1.67, 0.18]}
        rotation={[0.16, 0.15, 0.55]}
        scale={0.64}
      />

      <BasilLeaf3D
        position={[-0.30, -1.74, 0.43]}
        rotation={[0, 0.12, -0.42]}
        scale={0.60}
      />

      {/* Mozzarella and mushroom */}

      <Mozzarella3D
        position={[-0.55, -0.65, 1.00]}
      />

      <Mushroom3D
        position={[1.02, -1.30, 0.35]}
        scale={0.94}
      />
    </group>
  );
}

// ==========================================
// 09 - COMPLETE 3D CANVAS
// ==========================================

function IngredientsScene3D() {
  return (
    <div className="fresh-ingredients-canvas">
      <Canvas
        frameloop="always"
        camera={{
          position: [0, 0, 8.2],
          fov: 44,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
          touchAction: "pan-y",
        }}
      >
        <ambientLight intensity={0.95} />

        <hemisphereLight
          args={["#fff2dd", "#51241c", 1.2]}
        />

        <directionalLight
          position={[-3, 5, 6]}
          intensity={2.4}
          color="#fff0d8"
        />

        <directionalLight
          position={[3, 2, 5]}
          intensity={0.85}
          color="#ffe5c4"
        />

        <pointLight
          position={[-3, 1, 3]}
          intensity={13}
          distance={10}
          color="#ff613b"
        />

        <pointLight
          position={[3, 3, -2]}
          intensity={16}
          distance={10}
          color="#ffb669"
        />

        <IngredientArrangement />

        <Sparkles
          count={24}
          scale={[5.8, 5, 3]}
          size={2}
          speed={0.18}
          color="#ffad61"
          opacity={0.53}
        />
      </Canvas>
    </div>
  );
}

// ==========================================
// 10 - ORIGINAL CONTENT PRESERVED
// ==========================================

const features = [
  {
    icon: Leaf,
    title: "Freshly Selected",
    description: "Great pizza starts with great ingredients.",
  },
  {
    icon: Flame,
    title: "Bold Flavours",
    description: "Every topping brings something special.",
  },
  {
    icon: ChefHat,
    title: "Made with Care",
    description: "Crafted for the perfect bite.",
  },
];

// ==========================================
// FRESH INGREDIENTS MAIN SECTION
// ==========================================

export default function FreshIngredients() {
  return (
    <section
      className="fresh-ingredients"
      id="ingredients"
    >
      <div className="fresh-ingredients-inner">
        {/* LEFT CONTENT */}

        <div className="fresh-ingredients-content">
          <div className="fresh-ingredients-eyebrow">
            <span />
            THE ZESTO DIFFERENCE
            <span />
          </div>

          <h2 className="fresh-ingredients-heading">
            Fresh by Nature.
            <em> Bold by Design.</em>
          </h2>

          <p className="fresh-ingredients-description">
            Every unforgettable pizza begins with the
            ingredients. From vibrant tomatoes and fragrant
            basil to rich mozzarella and delicious toppings,
            we bring flavour to every slice.
          </p>

          <div className="fresh-ingredients-features">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  className="fresh-ingredients-feature"
                  key={feature.title}
                >
                  <span className="fresh-ingredients-feature-icon">
                    <Icon
                      size={23}
                      strokeWidth={1.8}
                    />
                  </span>

                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            className="fresh-ingredients-button"
            href="#menu"
          >
            Explore Our Menu
            <ArrowRight size={18} />
          </a>
        </div>

        {/* RIGHT - PREMIUM 3D INGREDIENTS */}

        <div className="fresh-ingredients-visual">
          <div className="fresh-ingredients-glow" />

          <IngredientsScene3D />

          <span className="fresh-ingredients-chip fresh-chip-top">
            FRESH TOMATO
          </span>

          <span className="fresh-ingredients-chip fresh-chip-right">
            BASIL & HERBS
          </span>

          <span className="fresh-ingredients-chip fresh-chip-bottom">
            RICH MOZZARELLA
          </span>

          <div className="fresh-ingredients-quality">
            <span className="fresh-quality-symbol">
              ✦
            </span>

            <div>
              <strong>Every Bite Matters</strong>
              <small>Freshness meets flavour</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
