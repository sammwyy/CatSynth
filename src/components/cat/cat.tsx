import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useTexture } from "@react-three/drei";
import { Vector3 } from "three";

function Cat3DModel() {
  const model = useLoader(FBXLoader, "/cat.fbx");
  const [texture] = useTexture(["/cat.png"]);

  useEffect(() => {
    return document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / (window.innerHeight - 5)) * -3;
      const move = new Vector3();
      move.x = x;
      move.y = y;
      move.z = 5;
      model.lookAt(move);
    });
  }, [model]);

  return (
    <mesh scale={0.035}>
      <primitive object={model} />

      <ambientLight intensity={0.2} />
      <directionalLight />
      <meshStandardMaterial displacementScale={0.2} map={texture} />
      <OrbitControls
        enableZoom={false}
        enableDamping={false}
        enablePan={false}
        enableRotate={false}
      />
    </mesh>
  );
}

export default function Cat() {
  const camera = new Vector3();
  camera.z = 10;

  return (
    <Canvas
      style={{
        position: "absolute",
        bottom: "-30%",
        width: "30%",
        height: "80vh",
      }}
      camera={{
        position: camera,
      }}
    >
      <Cat3DModel />
    </Canvas>
  );
}
