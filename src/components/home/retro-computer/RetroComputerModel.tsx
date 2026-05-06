import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { Mesh, Object3D } from "three";

type Props = {
  modelUrl: string;
};

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

export default function RetroComputerModel({ modelUrl }: Props) {
  const { scene } = useGLTF(modelUrl);
  const computer = useMemo(() => {
    const clone = scene.clone(true);
    prepareComputerModel(clone);

    return clone;
  }, [scene]);

  return <primitive object={computer} />;
}

