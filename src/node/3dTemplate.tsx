import { FC, memo, useEffect, useRef } from "react";
import { pix_3d_frame } from "../store/slice/nodeSlice";
import { signalViewNode } from "./baseViewNode";
import { useLocation } from "react-router-dom";
import { A3dContainer } from "./3d/container";

const A3D: FC<{ url: string; w: number; h: number }> = ({ url, w, h }) => {
  return (
    <div className={`w-full h-full relative`}>
      <A3dContainer url={url} w={w} h={h}></A3dContainer>
    </div>
  );
};

const Base3dFrame = memo(
  ({ url, id, w, h }: { url: string; id: string; w: number; h: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    useEffect(() => {
      console.log(location, "location");
      if (location.pathname === "/demo" && containerRef.current) {
        containerRef.current.style.pointerEvents = "auto";
      }
    }, [location]);
    return (
      <div
        ref={containerRef}
        id={id + "-frame-container"}
        className="w-full h-full pointer-events-none"
      >
        <A3D url={url} w={w} h={h} />
      </div>
    );
  }
);

export const A3dTemplate = () => {
  const frame = signalViewNode(pix_3d_frame);
  frame.createElement((_, { NodesState, PanelState, id }) => {
    return (
      <div className="w-full h-full p-2">
        <Base3dFrame
          id={id}
          w={NodesState.list[id].w * PanelState.tickUnit}
          h={NodesState.list[id].h * PanelState.tickUnit}
          url={NodesState.list[id].instance.option?.A3durl || ""}
        ></Base3dFrame>
      </div>
    );
  });
};
