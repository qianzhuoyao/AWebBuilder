import { Canvas } from "@react-three/fiber";
import { Model } from "./model";
import { OrbitControls } from "@react-three/drei";

import { Suspense } from "react";
export const A3dContainer: React.FC<{
  w: number;
  h: number;
  url: string;
}> = ({ url, w, h }) => {
  return (
    <div style={{ width: w + "px", height: h + "px" }}>
      <Canvas flat linear>
        <Suspense fallback={<>loading</>}>
          {/* {url ? <Model url={url} /> : <></>} */}
          <Model url={url} />
          <OrbitControls />
          {/* <Environment preset="sunset" background /> */}
        </Suspense>
      </Canvas>
    </div>
  );
};
