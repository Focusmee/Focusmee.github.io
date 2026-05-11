import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
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
const FLOAT_AMPLITUDE = 0.045;
const FLOAT_SPEED = 1.18;
const POINTER_POSITION_X = 0.025;
const POINTER_POSITION_Y = 0.018;
const POINTER_ROTATION_X = THREE.MathUtils.degToRad(2.4);
const POINTER_ROTATION_Y = THREE.MathUtils.degToRad(7.2);
const POINTER_ROTATION_Z = THREE.MathUtils.degToRad(1.4);
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

function FloatingComputerGroup({
  children,
  isEntering
}: {
  children: ReactNode;
  isEntering: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const pointerX = isEntering ? 0 : THREE.MathUtils.clamp(pointer.x, -1, 1);
    const pointerY = isEntering ? 0 : THREE.MathUtils.clamp(pointer.y, -1, 1);
    const floatingY = isEntering
      ? 0
      : Math.sin(clock.getElapsedTime() * FLOAT_SPEED) * FLOAT_AMPLITUDE;
    const damping = isEntering ? 10 : 4.6;

    group.position.x = THREE.MathUtils.damp(
      group.position.x,
      MODEL_POSITION[0] + pointerX * POINTER_POSITION_X,
      damping,
      delta
    );
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      MODEL_POSITION[1] + floatingY + Math.abs(pointerX) * POINTER_POSITION_Y,
      damping,
      delta
    );
    group.position.z = THREE.MathUtils.damp(
      group.position.z,
      MODEL_POSITION[2],
      damping,
      delta
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      MODEL_ROTATION[0] - pointerY * POINTER_ROTATION_X,
      damping,
      delta
    );
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      MODEL_ROTATION[1] + pointerX * POINTER_ROTATION_Y,
      damping,
      delta
    );
    group.rotation.z = THREE.MathUtils.damp(
      group.rotation.z,
      MODEL_ROTATION[2] - pointerX * POINTER_ROTATION_Z,
      damping,
      delta
    );
  });

  return (
    <group ref={groupRef} position={MODEL_POSITION} rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
      {children}
    </group>
  );
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
        <FloatingComputerGroup isEntering={isEntering}>
          <RetroComputerModel modelUrl={modelUrl} onScreenAnchor={handleScreenAnchor} />
          <ComputerScreenGlow anchor={screenAnchor} isEntering={isEntering} />
          <ComputerScreenTexture
            anchor={screenAnchor}
            isEntering={isEntering}
            onEnter={onEnter}
            transitionDurationMs={transitionDurationMs}
          />
        </FloatingComputerGroup>
      </Suspense>
      <ContactShadows
        position={[0, -1.86, 0]}
        opacity={0.18}
        scale={5.8}
        blur={4.4}
        far={2.4}
        resolution={512}
        color="#5d2548"
      />
    </Canvas>
  );
}
