import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
interface IModel {
  url: string;
}
export const Model = ({ url }: IModel) => {
  const [model, setModel] = useState<any>(null);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      gltf.scene && setModel(gltf.scene);
    });
  }, [url]);
  // console.log(gltf,'gltf')
  return <>{model ? <primitive object={model} scale={0.5} /> : <></>}</>;
};
