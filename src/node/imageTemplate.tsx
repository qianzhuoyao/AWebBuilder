import { memo, useState } from "react";
import { IViewNode, pic_Img } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { Image } from "@nextui-org/react";
import { useAutoSubscription } from "../comp/autoSubscription";

const BaseImage = memo(({ config }: { config: IViewNode }) => {
  const [src, setSrc] = useState(() => config.instance.option?.src);
  useAutoSubscription(config.id).render((value) => {
    console.log(value, "useAutoSubscription");
    setSrc(value.src);
  });
  return (
    <Image
      width={"100%"}
      height={"100%"}
      alt="BaseImage"
      className={"w-full h-full"}
      src={src}
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
