import { memo, useEffect, useRef } from "react";
import { pix_frame } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import Iframe from "react-iframe";
import { useLocation } from "react-router-dom";

const BaseFrame = memo(({ url, id }: { url: string; id: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  useEffect(() => {
    console.log(location, "location");
    if (location.pathname === "/demo" && containerRef.current) {
      containerRef.current.style.pointerEvents = "auto";
    }
  }, []);
  return (
    <div
      ref={containerRef}
      id={id + "-frame-container"}
      className="w-full h-full pointer-events-none"
    >
      <Iframe
        url={url}
        width="100%"
        height="100%"
        id={id + "-frame"}
        className={`w-full h-full relative`}
      />
    </div>
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
