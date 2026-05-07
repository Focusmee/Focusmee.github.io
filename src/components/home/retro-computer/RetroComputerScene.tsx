import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useMemo, useState } from "react";
import * as THREE from "three";
import RetroComputerModel from "./RetroComputerModel";
import type { ScreenAnchor } from "./RetroComputerModel";
import RetroComputerScreenPreview from "./RetroComputerScreenPreview";

type Props = {
  isEntering: boolean;
  modelUrl: string;
  onEnter: () => void;
};

const MODEL_POSITION: [number, number, number] = [0, -0.3, 0];
const MODEL_ROTATION_DEGREES = [0, 989, 0] as const;
const MODEL_ROTATION = MODEL_ROTATION_DEGREES.map((degree) =>
  THREE.MathUtils.degToRad(degree)
) as [number, number, number];
const MODEL_EULER = new THREE.Euler(...MODEL_ROTATION);
const MODEL_SCALE = 2.8;
const SCREEN_FIT_RATIO = 0.94;
const SCREEN_PIXEL_WIDTH = 320;
const HTML_TRANSFORM_PIXEL_TO_WORLD = 0.025;
const SCREEN_SURFACE_OFFSET = 0.014;
const FALLBACK_SCREEN_ANCHOR: ScreenAnchor = {
  height: 0.215,
  normal: [1, 0, 0],
  position: [0.088, 0.335, 0.032],
  rotation: [0, Math.PI / 2, 0],
  sourceName: "fallback",
  width: 0.3
};

function getModelWorldPosition(position: [number, number, number]) {
  return new THREE.Vector3(...position)
    .multiplyScalar(MODEL_SCALE)
    .applyEuler(MODEL_EULER)
    .add(new THREE.Vector3(...MODEL_POSITION));
}

function getModelWorldNormal(normal: [number, number, number]) {
  return new THREE.Vector3(...normal).applyEuler(MODEL_EULER).normalize();
}

function AnimatedCamera({
  isEntering,
  screenAnchor
}: Pick<Props, "isEntering"> & { screenAnchor: ScreenAnchor }) {
  const { camera } = useThree();
  const defaultPosition = useMemo(() => new THREE.Vector3(0, 0.64, 5.1), []);
  const defaultLookAtTarget = useMemo(() => new THREE.Vector3(-0.04, 0.26, 0.48), []);
  const screenCameraTarget = useMemo(() => {
    const target = getModelWorldPosition(screenAnchor.position);
    const normal = getModelWorldNormal(screenAnchor.normal);
    const enteringPosition = target.clone().addScaledVector(normal, 1.14);

    enteringPosition.y -= 0.02;

    return {
      enteringPosition,
      target
    };
  }, [screenAnchor]);

  useFrame((_, delta) => {
    const targetPosition = isEntering
      ? screenCameraTarget.enteringPosition
      : defaultPosition;
    const lookAtTarget = isEntering
      ? screenCameraTarget.target
      : defaultLookAtTarget;
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

function getFloatingScreenPosition(anchor: ScreenAnchor) {
  return anchor.position.map((value, index) =>
    value + anchor.normal[index] * SCREEN_SURFACE_OFFSET
  ) as [number, number, number];
}

function getScreenPixelHeight(anchor: ScreenAnchor) {
  return Math.round(SCREEN_PIXEL_WIDTH * (anchor.height / anchor.width));
}

function getScreenHtmlScale(anchor: ScreenAnchor) {
  return anchor.width * SCREEN_FIT_RATIO /
    (SCREEN_PIXEL_WIDTH * HTML_TRANSFORM_PIXEL_TO_WORLD);
}

function ComputerScreenGlow({
  anchor,
  isEntering
}: Pick<Props, "isEntering"> & { anchor: ScreenAnchor }) {
  return (
    <mesh position={getFloatingScreenPosition(anchor)} rotation={anchor.rotation}>
      <planeGeometry args={[anchor.width * SCREEN_FIT_RATIO, anchor.height * SCREEN_FIT_RATIO]} />
      <meshBasicMaterial
        color="#74f3ff"
        transparent
        opacity={isEntering ? 0.1 : 0.06}
        toneMapped={false}
      />
    </mesh>
  );
}

function ComputerScreenHtml({
  anchor,
  isEntering,
  onEnter
}: Pick<Props, "isEntering" | "onEnter"> & { anchor: ScreenAnchor }) {
  return (
    <Html
      center
      className="retro-computer-html-layer"
      occlude={false}
      position={getFloatingScreenPosition(anchor)}
      rotation={anchor.rotation}
      scale={getScreenHtmlScale(anchor)}
      transform
      zIndexRange={[30, 0]}
    >
      <div
        className="retro-computer-html-screen"
        style={{
          height: `${getScreenPixelHeight(anchor)}px`,
          width: `${SCREEN_PIXEL_WIDTH}px`
        }}
      >
        <RetroComputerScreenPreview isEntering={isEntering} onEnter={onEnter} />
      </div>
    </Html>
  );
}

export default function RetroComputerScene({ isEntering, modelUrl, onEnter }: Props) {
  const [screenAnchor, setScreenAnchor] = useState<ScreenAnchor>(FALLBACK_SCREEN_ANCHOR);
  const handleScreenAnchor = useCallback((anchor: ScreenAnchor | null) => {
    setScreenAnchor(anchor ?? FALLBACK_SCREEN_ANCHOR);
  }, []);

  return (
    <Canvas
      className="retro-computer-canvas"
      camera={{ fov: 32, position: [0, 0.64, 5.1] }}
      dpr={[1, 1.7]}
      gl={{ alpha: true, antialias: true }}
      shadows
    >
      <AnimatedCamera isEntering={isEntering} screenAnchor={screenAnchor} />
      <ambientLight intensity={0.82} />
      <directionalLight color="#fff1cf" intensity={1.2} position={[-3, 4, 4]} castShadow />
      <pointLight color="#77e9ff" intensity={1.6} position={[-0.45, 0.52, 1.1]} />
      <pointLight color="#ff8fb6" intensity={0.72} position={[2.5, 0.9, 2.8]} />
      <Suspense fallback={null}>
        <group position={MODEL_POSITION} rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
          <RetroComputerModel modelUrl={modelUrl} onScreenAnchor={handleScreenAnchor} />
          <ComputerScreenGlow anchor={screenAnchor} isEntering={isEntering} />
          <ComputerScreenHtml anchor={screenAnchor} isEntering={isEntering} onEnter={onEnter} />
        </group>
      </Suspense>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.5, 5.8]} />
        <meshStandardMaterial color="#f2a4b6" roughness={0.78} metalness={0.02} />
      </mesh>
    </Canvas>
  );
}
