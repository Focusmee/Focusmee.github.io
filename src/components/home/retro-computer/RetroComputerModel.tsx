import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { Box3, Vector3 } from "three";
import type { Mesh, Object3D } from "three";

export type ScreenAnchor = {
  height: number;
  normal: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  sourceName: string;
  width: number;
};

type Props = {
  modelUrl: string;
  onScreenAnchor?: (anchor: ScreenAnchor | null) => void;
};

const SCREEN_NODE_NAMES = ["monitor_screen_0", "Cube_screen_0"];

function prepareComputerModel(scene: Object3D) {
  scene.traverse((object) => {
    const mesh = object as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });
}

function findScreenMesh(scene: Object3D) {
  let exactMatch: Mesh | null = null;
  let fuzzyMatch: Mesh | null = null;

  scene.traverse((object) => {
    const mesh = object as Mesh;

    if (!mesh.isMesh) {
      return;
    }

    const name = mesh.name.toLowerCase();

    if (SCREEN_NODE_NAMES.some((screenName) => screenName.toLowerCase() === name)) {
      exactMatch = mesh;
      return;
    }

    if (!fuzzyMatch && (name.includes("screen") || name.includes("display"))) {
      fuzzyMatch = mesh;
    }
  });

  return exactMatch ?? fuzzyMatch;
}

function getAnchorFromScreenMesh(mesh: Mesh): ScreenAnchor {
  const box = new Box3().setFromObject(mesh);
  const center = new Vector3();
  const size = new Vector3();

  box.getCenter(center);
  box.getSize(size);

  if (size.x <= size.y && size.x <= size.z) {
    return {
      height: size.y,
      normal: [1, 0, 0],
      position: [center.x, center.y, center.z],
      rotation: [0, Math.PI / 2, 0],
      sourceName: mesh.name,
      width: size.z
    };
  }

  if (size.z <= size.x && size.z <= size.y) {
    return {
      height: size.y,
      normal: [0, 0, 1],
      position: [center.x, center.y, center.z],
      rotation: [0, 0, 0],
      sourceName: mesh.name,
      width: size.x
    };
  }

  return {
    height: size.z,
    normal: [0, 1, 0],
    position: [center.x, center.y, center.z],
    rotation: [Math.PI / 2, 0, 0],
    sourceName: mesh.name,
    width: size.x
  };
}

function findScreenAnchor(scene: Object3D) {
  const screenMesh = findScreenMesh(scene);

  if (!screenMesh) {
    return null;
  }

  scene.updateMatrixWorld(true);

  return getAnchorFromScreenMesh(screenMesh);
}

export default function RetroComputerModel({ modelUrl, onScreenAnchor }: Props) {
  const { scene } = useGLTF(modelUrl);
  const { computer, screenAnchor } = useMemo(() => {
    const clone = scene.clone(true);
    prepareComputerModel(clone);

    return {
      computer: clone,
      screenAnchor: findScreenAnchor(clone)
    };
  }, [scene]);

  useEffect(() => {
    onScreenAnchor?.(screenAnchor);
  }, [onScreenAnchor, screenAnchor]);

  return <primitive object={computer} />;
}
