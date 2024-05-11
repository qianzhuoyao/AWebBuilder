import { memo, useState } from "react";
import { IViewNode, pic_Img } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { Image } from "@nextui-org/react";
import { useAutoSubscription } from "../comp/autoSubscription";
import { parseContent } from "../comp/parseTemplate";

const BaseImage = memo(({ config, id }: { config: IViewNode, id: string }) => {
  const [content, setContent] = useState(() => config.instance.option);
  useAutoSubscription(config.id).render((value) => {
    console.log(value, "useAutoSubscription");
    const result = parseContent(value, id)
    setContent(result);
  });
  return (
    <Image
      width={"100%"}
      height={"100%"}
      alt="BaseImage"
      className={"w-full h-full"}
      src={content?.src}
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
        <BaseImage config={NodesState.list[id]} id={id}></BaseImage>
      </>
    );
  });
};
