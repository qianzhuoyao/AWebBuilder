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
  // const gltf = useLoader(GLTFLoader, 'http://10.180.5.186:30081/visualize_download//view/52460ab87d37442e899e4adb1deab7cb.glb');
  // console.log(gltf,'gltf')
  return <>{model ? <primitive object={model} scale={0.5} /> : <></>}</>;
};
