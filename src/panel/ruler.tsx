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
  updateVerticalGuidelines,
  updateHorizontalGuidelines,
} from "../store/slice/panelSlice";
import { useCustomHotKeys } from "./hotKey";
import { AR_PANEL_DOM_ID } from "../contant";
import { useTakePanel } from "../comp/useTakeStore";
import { useTakeNodeData } from "../comp/useTakeNodeData";

export const ARuler = React.memo(() => {
  const [sceneLock, setSceneLock] = useState(true);
  const ges = useRef<{ g: Gesto | null }>({
    g: null,
  });
  useHotkeys("s", () => setSceneLock(false), { keyup: false, keydown: true });
  useHotkeys("s", () => setSceneLock(true), { keyup: true, keydown: false });
  const NodesState = useTakeNodeData();
  const PanelState = useTakePanel();
  const [snapX, setSnapX] = useState<number[]>([]);
  const [snapY, setSnapY] = useState<number[]>([]);
  const guides1 = useRef<Guides>(null);
  const guides2 = useRef<Guides>(null);
  let scrollX = PanelState.rulerMinX;
  let scrollY = PanelState.rulerMinY;

  const dispatch = useDispatch();

  useCustomHotKeys();

  // let ges: Gesto | null = null;
  React.useEffect(() => {
    const dom = document.getElementById(AR_PANEL_DOM_ID);

    if (!dom) {
      return;
    }
    ges.current.g = new Gesto(dom);

    ges.current.g.on("drag", (e) => {
      if (!sceneLock) {
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
      ges.current.g?.off();
      ArDomResizeObserver.unobserve(dom);
      ArDomResizeObserver.disconnect();
    };
  }, [PanelState.lockTransform, sceneLock]);

  React.useEffect(() => {
    setSnapX(Object.values(NodesState.list).map((i) => i.x));
    setSnapY(Object.values(NodesState.list).map((i) => i.y));
  }, [NodesState]);

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
        snaps={snapY}
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
        onChangeGuides={(e) => {
          dispatch(
            updateHorizontalGuidelines(
              e.guides.map((i) => {
                return (
                  i * PanelState.tickUnit +
                  10 * PanelState.tickUnit * PanelState.snap
                );
              })
            )
          );
        }}
        onDragStart={() => {}}
        onDrag={() => {}}
        onDragEnd={() => {}}
        onClickRuler={() => {}}
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
        snaps={snapX}
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
          console.log(v, "dawdwdwdwd");
          return `${
            v * PanelState.tickUnit + 10 * PanelState.tickUnit * PanelState.snap
          }px`;
        }}
        displayDragPos={true}
        displayGuidePos={true}
        guidesOffset={50}
        onChangeGuides={(e) => {
          console.log(
            e.guides.map((i) => {
              return (
                i * PanelState.tickUnit +
                10 * PanelState.tickUnit * PanelState.snap
              );
            }),
            "eeeeee"
          );
          dispatch(
            updateVerticalGuidelines(
              e.guides.map((i) => {
                return (
                  i * PanelState.tickUnit +
                  10 * PanelState.tickUnit * PanelState.snap
                );
              })
            )
          );
        }}
        onDragStart={() => {}}
        onDrag={() => {}}
        onDragEnd={() => {}}
        onClickRuler={() => {}}
      />

      <AScene></AScene>
    </div>
  );
});
