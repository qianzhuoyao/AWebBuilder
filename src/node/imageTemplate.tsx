import { memo } from "react";
import { IViewNode, pic_Img } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { Image } from "@nextui-org/react";

const BaseImage = memo(({ config }: { config: IViewNode }) => {
  return (
    <Image
      width={"100%"}
      height={"100%"}
      alt="BaseImage"
      className={"w-full h-full"}
      src={config.instance.option?.src}
      classNames={{
        wrapper: "w-full h-full",
      }}
    ></Image>
  );
});

export const ImageTemplate = () => {
  const image = signalViewNode(pic_Img);
  image.createElement((_, { NodesState, id }) => {
    return (
      <>
        <BaseImage config={NodesState.list[id]}></BaseImage>
      </>
    );
  });
};
