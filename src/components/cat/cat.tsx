import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useEffect } from "react";
import { Euler, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

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
      move.z = 10;
      // model.lookAt(move);
      model.rotateOnAxis(new Vector3(x, y, 0), Math.PI);
    });
  }, [model]);

  return (
    <mesh scale={1}>
      <primitive object={model} />

      <ambientLight intensity={0.3} />
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
  const position = new Vector3();
  position.z = 10;
  position.y = 250;

  const rotation = new Euler();
  rotation.x = 90;
  rotation.y = 90;
  rotation.z = 90;

  return (
    <Canvas
      style={{
        height: "100%",
        maxHeight: "40vh",
        width: "100%",

        background: "red",
      }}
      camera={{ position, rotation }}
    >
      <Cat3DModel />
    </Canvas>
  );
}
