import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import RetroComputerModel from "./RetroComputerModel";
import RetroComputerScreenPreview from "./RetroComputerScreenPreview";

type Props = {
  isEntering: boolean;
  modelUrl: string;
  onEnter: () => void;
};

const MODEL_POSITION: [number, number, number] = [0, 0, 0];
const MODEL_ROTATION_DEGREES = [0,989, 0] as const;
const MODEL_ROTATION = MODEL_ROTATION_DEGREES.map((degree) =>
  THREE.MathUtils.degToRad(degree)
) as [number, number, number];
const MODEL_SCALE = 5.2;
const SCREEN_POSITION: [number, number, number] = [-0.04, -0.145, 0.305];
const SCREEN_ROTATION: [number, number, number] = [Math.PI / 2, 0, 0];

function AnimatedCamera({ isEntering }: Pick<Props, "isEntering">) {
  const { camera } = useThree();
  const defaultPosition = useMemo(() => new THREE.Vector3(0, 0.64, 5.1), []);
  const enteringPosition = useMemo(() => new THREE.Vector3(-0.04, 0.18, 1.55), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(-0.04, 0.26, 0.48), []);
  

  useFrame((_, delta) => {
    const targetPosition = isEntering ? enteringPosition : defaultPosition;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const ease = 1 - Math.exp(-delta * (isEntering ? 2.9 : 2.2));

    camera.position.lerp(targetPosition, ease);
    perspectiveCamera.fov = THREE.MathUtils.damp(
      perspectiveCamera.fov,
      isEntering ? 20 : 32,
      2.8,
      delta
    );
    perspectiveCamera.updateProjectionMatrix();
    camera.lookAt(lookAtTarget);
  });

  return null;
}

function ComputerScreenGlow({ isEntering }: Pick<Props, "isEntering">) {
  return (
    <mesh position={SCREEN_POSITION} rotation={SCREEN_ROTATION}>
      <planeGeometry args={[0.34, 0.23]} />
      <meshBasicMaterial
        color="#74f3ff"
        transparent
        opacity={isEntering ? 0.1 : 0.06}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function RetroComputerScene({ isEntering, modelUrl, onEnter }: Props) {
  return (
    <Canvas
      className="retro-computer-canvas"
      camera={{ fov: 32, position: [0, 0.64, 5.1] }}
      dpr={[1, 1.7]}
      gl={{ alpha: true, antialias: true }}
      shadows
    >
      <AnimatedCamera isEntering={isEntering} />
      <ambientLight intensity={0.82} />
      <directionalLight color="#fff1cf" intensity={1.2} position={[-3, 4, 4]} castShadow />
      <pointLight color="#77e9ff" intensity={1.6} position={[-0.45, 0.52, 1.1]} />
      <pointLight color="#ff8fb6" intensity={0.72} position={[2.5, 0.9, 2.8]} />
      <Suspense fallback={null}>
        <group position={MODEL_POSITION} rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
          <RetroComputerModel modelUrl={modelUrl} />
          <ComputerScreenGlow isEntering={isEntering} />
        </group>
      </Suspense>
      <Html className="retro-computer-html-layer" fullscreen zIndexRange={[30, 0]}>
        <div className="retro-computer-html-screen">
          <RetroComputerScreenPreview isEntering={isEntering} onEnter={onEnter} />
        </div>
      </Html>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.5, 5.8]} />
        <meshStandardMaterial color="#f2a4b6" roughness={0.78} metalness={0.02} />
      </mesh>
    </Canvas>
  );
}
