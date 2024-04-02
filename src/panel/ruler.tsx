import { useRef, useState } from "react";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
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
import { useCustomHotKeys } from "./hotKey";
import { AR_PANEL_DOM_ID, ATTR_TAG, Node } from "../contant";

export const ARuler = React.memo(() => {
  const [force, setForce] = useState(false);

  useHotkeys("q", () => setForce(true), { keyup: false, keydown: true });
  useHotkeys("q", () => setForce(false), { keyup: true, keydown: false });

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  const guides1 = useRef<Guides>(null);
  const guides2 = useRef<Guides>(null);
  let scrollX = PanelState.rulerMinX;
  let scrollY = PanelState.rulerMinY;

  const dispatch = useDispatch();

  // const restore = () => {
  //   scrollX = 0;
  //   scrollY = 0;
  //   guides1.current?.scroll(0);
  //   guides1.current?.scrollGuides(0);
  //   guides2.current?.scroll(0);
  //   guides2.current?.scrollGuides(0);
  // };

  useCustomHotKeys();

  // React.useEffect(() => {
  //   guides1.current?.resize();
  //   guides2.current?.resize();
  // }, [PanelState]);

  let ges: Gesto | null = null;
  React.useEffect(() => {
    const dom = document.getElementById(AR_PANEL_DOM_ID);

    if (!dom) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ges = new Gesto(dom);
    ges.on("drag", (e) => {
      if (
        !PanelState.lockTransform &&
        (e.inputEvent.target as HTMLElement).getAttribute(ATTR_TAG) !== Node &&
        !force
      ) {
        scrollX -= e.deltaX;
        scrollY -= e.deltaY;
        guides1.current?.scrollGuides(scrollY);
        guides1.current?.scroll(scrollX);

        guides2.current?.scrollGuides(scrollX);
        guides2.current?.scroll(scrollY);
        dispatch(updateRulerMinY(guides1.current?.scrollPos));
        dispatch(updateRulerMinX(guides2.current?.scrollPos));
      }
    });

    const ArDomResizeObserver = new ResizeObserver(() => {
      guides1.current?.resize();
      guides2.current?.resize();
    });
    ArDomResizeObserver.observe(dom);
    return () => {
      ges?.off();
      ArDomResizeObserver.unobserve(dom);
      ArDomResizeObserver.disconnect();
    };
  }, [PanelState.lockTransform, force]);
  return (
    <div className="page h-full relative">
      {/* <div className="box" onClick={restore}></div> */}
      <Guides
        ref={guides1}
        type="horizontal"
        className="bg-[#333333]"
        zoom={1}
        unit={50}
        lockGuides={[]}
        snapThreshold={PanelState.snap}
        textFormat={(v) => `${Math.floor(v * PanelState.tickUnit)}px`}
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
        textFormat={(v) => `${Math.floor(v * PanelState.tickUnit)}px`}
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
});
