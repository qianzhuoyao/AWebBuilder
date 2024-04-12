import { memo, useEffect } from "react";
import { pix_frame } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import Iframe from "react-iframe";

const BaseFrame = memo(({ url, id }: { url: string; id: string }) => {

  useEffect(()=>{
    console.log('asdasdfasdasdasdasd')
  },[])

  return (
    <>
      <Iframe
        url={url}
        width="100%"
        height="100%"
        id={id + "-frame"}
        className={`${"pointer-events-none"} w-full h-full relative`}
      />
    </>
  );
});

export const IframeTemplate = () => {
  const frame = signalViewNode(pix_frame);
  frame.createElement((_, { NodesState, id }) => {
    return (
      <div className="w-full h-full p-2">
        <BaseFrame
          id={id}
          url={NodesState.list[id].instance.option?.url || ""}
        ></BaseFrame>
      </div>
    );
  });
};
