import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
interface IModel {
  url: string;
}
export const Model = ({ url }: IModel) => {
    
  const gltf = useLoader(GLTFLoader, '/test.glb');
  console.log(gltf,'gltf')
  return (
    <>
      <primitive object={gltf.scene} scale={0.5} />
    </>
  );
};
