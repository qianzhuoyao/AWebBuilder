import { useRef } from "react";
import * as React from "react";

import Guides from "@scena/react-guides";
import Gesto from "gesto";
import { useDispatch } from "react-redux";
import { AScene } from "./operation";
import {
  updateRulerMinY,
  updateRulerMinX,
  IPs,
} from "../store/slice/panelSlice";
import { useSelector } from "react-redux";

export const ARuler = () => {
  const guides1 = useRef<Guides>(null);
  const guides2 = useRef<Guides>(null);
  let scrollX = 0;
  let scrollY = 0;

  const dispatch = useDispatch();

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, "statescvsfv");
    return state.panelSlice;
  });

  const restore = () => {
    scrollX = 0;
    scrollY = 0;
    guides1.current?.scroll(0);
    guides1.current?.scrollGuides(0);
    guides2.current?.scroll(0);
    guides2.current?.scrollGuides(0);
  };

  React.useEffect(() => {
    const dom = document.getElementById("Ar-Panel");

    if (!dom) {
      return;
    }
    new Gesto(dom).on("drag", (e) => {
      scrollX -= e.deltaX;
      scrollY -= e.deltaY;

      guides1.current?.scrollGuides(scrollY);
      guides1.current?.scroll(scrollX);

      guides2.current?.scrollGuides(scrollX);
      guides2.current?.scroll(scrollY);

      dispatch(updateRulerMinY(guides1.current?.scrollPos));
      dispatch(updateRulerMinX(guides2.current?.scrollPos));
      console.log(guides1.current, "e-e");
    });

    const ArDomResizeObserver = new ResizeObserver(() => {
      guides1.current?.resize();
      guides2.current?.resize();
    });
    ArDomResizeObserver.observe(dom);
    return () => {
      ArDomResizeObserver.unobserve(dom);
      ArDomResizeObserver.disconnect()
    };
    // window.addEventListener("resize", () => {
    //   guides1.current?.resize();
    //   guides2.current?.resize();
    // });
  }, []);
  return (
    <div className="page h-full relative">
      <div className="box" onClick={restore}></div>
      <Guides
        ref={guides1}
        type="horizontal"
        className="bg-[#333333]"
        zoom={1}
        unit={50}
        lockGuides={[]}
        snapThreshold={PanelState.snap}
        textFormat={(v) => `${v * PanelState.tickUnit}px`}
        snaps={[1, 2, 3]}
        digit={1}
        style={{ height: `${PanelState.offset}px`, width: "calc(100%px)" }}
        rulerStyle={{
          left: `${PanelState.offset}px`,
          width: `calc(100% - ${PanelState.offset}px)`,
          height: "100%",
        }}
        dragPosFormat={(v) =>
          `${
            v * PanelState.tickUnit + 10 * PanelState.tickUnit * PanelState.snap
          }px`
        }
        displayDragPos={true}
        displayGuidePos={true}
        guidesOffset={50}
        onChangeGuides={({ guides }) => {
          console.log("horizontal", guides);
        }}
        onDragStart={(e) => {
          console.log("dragStart", e);
        }}
        onDrag={(e) => {
          console.log("drag", e);
        }}
        onDragEnd={(e) => {
          console.log("dragEnd", e);
        }}
        onClickRuler={(e) => {
          console.log("?", e);
        }}
      />
      <Guides
        ref={guides2}
        type="vertical"
        zoom={1}
        unit={50}
        font="10px"
        lockGuides={[]}
        snapThreshold={PanelState.snap}
        textFormat={(v) => `${v * PanelState.tickUnit}px`}
        snaps={[1, 2, 3]}
        digit={1}
        rulerStyle={{
          height: "calc(100%)",
          width: "100%",
        }}
        style={{
          width: `${PanelState.offset}px`,
          height: `calc(100% - ${PanelState.offset}px)`,
        }}
        dragPosFormat={(v) => {
          console.log(v, "cascascas");
          return `${
            v * PanelState.tickUnit + 10 * PanelState.tickUnit * PanelState.snap
          }px`;
        }}
        displayDragPos={true}
        displayGuidePos={true}
        guidesOffset={50}
        onChangeGuides={({ guides }) => {
          console.log("horizontal", guides);
        }}
        onDragStart={(e) => {
          console.log("dragStart", e);
        }}
        onDrag={(e) => {
          console.log("drag", e, guides2);
        }}
        onDragEnd={(e) => {
          console.log("dragEnd", e);
        }}
        onClickRuler={(e) => {
          console.log("?", e);
        }}
      />
      <AScene></AScene>
    </div>
  );
};
