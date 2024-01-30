import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import { memo, useEffect, useMemo, useRef } from "react";
import { INs, IViewNode, updatePosition } from "../store/slice/nodeSlice";
import Moveable, { OnScale } from "moveable";
import { ATTR_TAG, Node, SCENE } from "../contant";

const useWidth = (state: { tickUnit: number; w: number }) => {
  return useMemo(() => {
    const { tickUnit, w } = state;
    return w / tickUnit;
  }, [state]);
};
const useHeight = (state: { tickUnit: number; h: number }) => {
  return useMemo(() => {
    const { tickUnit, h } = state;
    return h / tickUnit;
  }, [state]);
};

const NodeSlot = memo(({ node }: { node: IViewNode }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  useEffect(() => {
    let isDragging = false;
    nodeRef.current?.setAttribute(ATTR_TAG, Node);
    const dom = document.getElementById(node.id);
    const CONTAINER = document.getElementById(SCENE);
    if (!dom || !CONTAINER) {
      return;
    }
    const moveable = new Moveable(CONTAINER, {
      target: dom,
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: CONTAINER,
      draggable: true,
      resizable: true,
      scalable: true,
      rotatable: true,

      // Enabling pinchable lets you use events that
      // can be used in draggable, resizable, scalable, and rotateable.

      keepRatio: false,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
    });
    moveable
      .on("dragStart", ({ target }) => {
        console.log("onDragStart", target);
        isDragging = false;
      })
      .on(
        "drag",
        ({
          target,

          left,
          top,
        }) => {
          console.log("onDrag left, top", left, top);
          target!.style.left = `${left}px`;
          target!.style.top = `${top}px`;
          isDragging = true;
          // console.log("onDrag translate", dist);
          // target!.style.transform = transform;
        }
      )
      .on("dragEnd", ({ target }) => {
        console.log(
          "onDragEnd",
          PanelState,
          target.getBoundingClientRect().left,
          target,
          parseFloat(target.style.left) * PanelState.tickUnit,
          parseFloat(target.style.top) * PanelState.tickUnit
        );
        isDragging &&
          dispatch(
            updatePosition({
              x: parseFloat(target.style.left) * PanelState.tickUnit,
              y: parseFloat(target.style.top) * PanelState.tickUnit,
            })
          );
      });

    /* resizable */
    moveable
      .on("resizeStart", ({ target }) => {
        console.log("onResizeStart", target);
      })
      .on("resize", ({ target, width, drag,height, delta }) => {
        console.log("onResize",delta, target);
        // delta[0] && (target!.style.width = `${width}px`);
        // delta[1] && (target!.style.height = `${height}px`);
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        target.style.transform = drag.transform;
      })
      .on("resizeEnd", ({ target, isDrag }) => {
        console.log("onResizeEnd", target, isDrag);
      });

    /* scalable */
    moveable
      .on("scaleStart", ({ target }) => {
        console.log("onScaleStart", target);
      })
      .on(
        "scale",
        ({
          target,
          scale,

          transform,
        }: OnScale) => {
          console.log("onScale scale", scale);
          target!.style.transform = transform;
        }
      )
      .on("scaleEnd", ({ target, isDrag }) => {
        console.log("onScaleEnd", target, isDrag);
      });

    /* rotatable */
    moveable
      .on("rotateStart", ({ target }) => {
        console.log("onRotateStart", target);
      })
      .on("rotate", ({ target, dist, transform }) => {
        console.log("onRotate", dist);
        target!.style.transform = transform;
      })
      .on("rotateEnd", ({ target, isDrag }) => {
        console.log("onRotateEnd", target, isDrag);
      });
    return () => {
      moveable.destroy();
    };
  }, [PanelState, dispatch, node.id]);

  console.log(node, "node-snode");
  return (
    <div
      ref={nodeRef}
      id={node.id}
      className="absolute bg-[red]"
      style={{
        left: node.x / PanelState.tickUnit + "px",
        top: node.y / PanelState.tickUnit + "px",
        width:
          useWidth({
            tickUnit: PanelState.tickUnit,
            w: node.w,
          }) + "px",
        height:
          useHeight({
            h: node.h,
            tickUnit: PanelState.tickUnit,
          }) + "px",
      }}
    ></div>
  );
});

export const AScene = () => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });

  return (
    <>
      <div
        className="absolute w-[calc(100%_-_40px)] h-[calc(100%_-_40px)]"
        style={{
          left: "30px",
          top: "30px",
        }}
      >
        <div id="container" className="relative w-full h-full overflow-hidden">
          <div
            id={SCENE}
            className="absolute bg-[#232324] overflow-hidden"
            style={{
              left: PanelState.panelLeft - PanelState.rulerMinX + "px",
              top: PanelState.panelTop - PanelState.rulerMinY + "px",
              width: PanelState.panelWidth / PanelState.tickUnit + "px",
              height: PanelState.panelHeight / PanelState.tickUnit + "px",
            }}
          >
            <div className="relative w-full h-full">
              {[...Object.values(NodesState.list)].map((node) => {
                return <NodeSlot key={node.id} node={node}></NodeSlot>;
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
