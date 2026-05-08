import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import RetroComputerModel from "./RetroComputerModel";
import type { ScreenAnchor } from "./RetroComputerModel";
import {
  RETRO_SCREEN_TEXTURE_HEIGHT,
  RETRO_SCREEN_TEXTURE_WIDTH,
  drawRetroComputerScreen,
  isPressStartUvHit
} from "./retroComputerScreenTexture";

type Props = {
  isEntering: boolean;
  modelUrl: string;
  onEnter: () => void;
  transitionDurationMs: number;
};

const MODEL_POSITION: [number, number, number] = [0, -0.3, 0];
const MODEL_ROTATION_DEGREES = [0, 989, 0] as const;
const MODEL_ROTATION = MODEL_ROTATION_DEGREES.map((degree) =>
  THREE.MathUtils.degToRad(degree)
) as [number, number, number];
const MODEL_EULER = new THREE.Euler(...MODEL_ROTATION);
const MODEL_SCALE = 2.8;
const SCREEN_FIT_RATIO = 0.9;
const SCREEN_GLOW_OFFSET = 0.018;
const SCREEN_TEXTURE_OFFSET = 0.032;
const FALLBACK_SCREEN_ANCHOR: ScreenAnchor = {
  height: 0.221,
  normal: [1, 0, 0],
  position: [0.083, 0.406, 0.042],
  rotation: [0, Math.PI / 2, 0],
  sourceName: "fallback",
  width: 0.3
};

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

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
  screenAnchor,
  transitionDurationMs
}: Pick<Props, "isEntering" | "transitionDurationMs"> & { screenAnchor: ScreenAnchor }) {
  const { camera } = useThree();
  const transitionStartRef = useRef<number | null>(null);
  const defaultPosition = useMemo(() => new THREE.Vector3(0, 0.64, 5.1), []);
  const defaultLookAtTarget = useMemo(() => new THREE.Vector3(-0.04, 0.26, 0.48), []);
  const activeLookAtTarget = useMemo(() => new THREE.Vector3(), []);
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

  useFrame(({ clock }, delta) => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    if (isEntering) {
      if (transitionStartRef.current === null) {
        transitionStartRef.current = clock.getElapsedTime();
      }

      const progress = clamp01(
        (clock.getElapsedTime() - transitionStartRef.current) /
          (transitionDurationMs / 1000)
      );
      const easedProgress = easeInOutCubic(progress);

      camera.position.lerpVectors(
        defaultPosition,
        screenCameraTarget.enteringPosition,
        easedProgress
      );
      activeLookAtTarget.lerpVectors(
        defaultLookAtTarget,
        screenCameraTarget.target,
        easedProgress
      );
      perspectiveCamera.fov = THREE.MathUtils.lerp(32, 16, easedProgress);
      perspectiveCamera.updateProjectionMatrix();
      camera.lookAt(activeLookAtTarget);
      return;
    }

    transitionStartRef.current = null;
    camera.position.lerp(defaultPosition, 1 - Math.exp(-delta * 2.2));
    perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, 32, 2.8, delta);
    perspectiveCamera.updateProjectionMatrix();
    camera.lookAt(defaultLookAtTarget);
  });

  return null;
}

function getFloatingScreenPosition(anchor: ScreenAnchor, offset: number) {
  return anchor.position.map((value, index) =>
    value + anchor.normal[index] * offset
  ) as [number, number, number];
}

function ComputerScreenGlow({
  anchor,
  isEntering
}: Pick<Props, "isEntering"> & { anchor: ScreenAnchor }) {
  return (
    <mesh position={getFloatingScreenPosition(anchor, SCREEN_GLOW_OFFSET)} rotation={anchor.rotation}>
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

function ComputerScreenTexture({
  anchor,
  isEntering,
  onEnter,
  transitionDurationMs
}: Pick<Props, "isEntering" | "onEnter" | "transitionDurationMs"> & { anchor: ScreenAnchor }) {
  const lastTextureUpdateRef = useRef(-1);
  const transitionStartRef = useRef<number | null>(null);
  const screen = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = RETRO_SCREEN_TEXTURE_WIDTH;
    canvas.height = RETRO_SCREEN_TEXTURE_HEIGHT;

    drawRetroComputerScreen(canvas, {
      elapsed: 0,
      isEntering: false,
      transitionProgress: 0
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    return { canvas, texture };
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
      screen.texture.dispose();
    };
  }, [screen]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (elapsed - lastTextureUpdateRef.current < 1 / 24) {
      return;
    }

    if (isEntering && transitionStartRef.current === null) {
      transitionStartRef.current = elapsed;
    }

    if (!isEntering) {
      transitionStartRef.current = null;
    }

    const transitionProgress =
      isEntering && transitionStartRef.current !== null
        ? clamp01((elapsed - transitionStartRef.current) / (transitionDurationMs / 1000))
        : 0;

    lastTextureUpdateRef.current = elapsed;
    drawRetroComputerScreen(screen.canvas, {
      elapsed,
      isEntering,
      transitionProgress
    });
    screen.texture.needsUpdate = true;
  });

  const handleScreenClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    if (!isEntering && isPressStartUvHit(event.uv)) {
      onEnter();
    }
  };
  const handleScreenPointerMove = (event: ThreeEvent<PointerEvent>) => {
    document.body.style.cursor = !isEntering && isPressStartUvHit(event.uv) ? "pointer" : "";
  };
  const handleScreenPointerOut = () => {
    document.body.style.cursor = "";
  };

  return (
    <mesh
      onClick={handleScreenClick}
      onPointerMove={handleScreenPointerMove}
      onPointerOut={handleScreenPointerOut}
      position={getFloatingScreenPosition(anchor, SCREEN_TEXTURE_OFFSET)}
      rotation={anchor.rotation}
      renderOrder={20}
    >
      <planeGeometry args={[anchor.width * SCREEN_FIT_RATIO, anchor.height * SCREEN_FIT_RATIO]} />
      <meshBasicMaterial
        map={screen.texture}
        depthTest={false}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function RetroComputerScene({
  isEntering,
  modelUrl,
  onEnter,
  transitionDurationMs
}: Props) {
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
      <AnimatedCamera
        isEntering={isEntering}
        screenAnchor={screenAnchor}
        transitionDurationMs={transitionDurationMs}
      />
      <ambientLight intensity={0.82} />
      <directionalLight color="#fff1cf" intensity={1.2} position={[-3, 4, 4]} castShadow />
      <pointLight color="#77e9ff" intensity={1.6} position={[-0.45, 0.52, 1.1]} />
      <pointLight color="#ff8fb6" intensity={0.72} position={[2.5, 0.9, 2.8]} />
      <Suspense fallback={null}>
        <group position={MODEL_POSITION} rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
          <RetroComputerModel modelUrl={modelUrl} onScreenAnchor={handleScreenAnchor} />
          <ComputerScreenGlow anchor={screenAnchor} isEntering={isEntering} />
          <ComputerScreenTexture
            anchor={screenAnchor}
            isEntering={isEntering}
            onEnter={onEnter}
            transitionDurationMs={transitionDurationMs}
          />
        </group>
      </Suspense>
      <mesh position={[0, -1.72, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.5, 5.8]} />
        <meshStandardMaterial color="#f2a4b6" roughness={0.78} metalness={0.02} />
      </mesh>
    </Canvas>
  );
}
