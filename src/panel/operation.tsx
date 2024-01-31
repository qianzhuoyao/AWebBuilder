import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";

import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import {
  INs,
  IViewNode,
  updatePosition,
  updateSize,
  updateTargets,
} from "../store/slice/nodeSlice";
import { ATTR_TAG, Node, SCENE } from "../contant";
import { BaseChart } from "../node/chart";

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

const Temp: FC<{ id: string }> = ({ id }) => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  console.log(id, NodesState, PanelState, "id[p-d-dd-d-d-d-");
  if (NodesState.list[id].classify === "chart") {
    return (
      <BaseChart
        type={NodesState.list[id].instance.type}
        width={NodesState.list[id].w / PanelState.tickUnit}
        height={NodesState.list[id].h / PanelState.tickUnit}
        options={NodesState.list[id].instance.option}
      ></BaseChart>
    );
  }

  return <></>;
};

const NodeSlot = memo(({ node }: { node: IViewNode }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }
    [...nodeRef.current.getElementsByTagName("*")].forEach((ele) => {
      ele.setAttribute(ATTR_TAG, Node);
    });
  }, [NodesState]);

  const onHandleSelectedCurrent = useCallback(() => {
    dispatch(updateTargets(nodeRef.current));
  }, [dispatch]);

  console.log(node, "node-snode");
  return (
    <div
      ref={nodeRef}
      id={node.id}
      className="absolute target"
      onClick={onHandleSelectedCurrent}
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
    >
      <Temp id={node.id}></Temp>
    </div>
  );
});

const NodeContainer = () => {
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);

  const dispatch = useDispatch();
 

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  return (
    <>
      <Moveable
        ref={moveableRef}
        origin={false}
        keepRatio={false}
        target={NodesState.targets}
        draggable={true}
        resizable={true}
        scalable={true}
        rotatable={true}
        onClickGroup={(e) => {
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onRender={(e) => {
          e.target.style.cssText += e.cssText;
        }}
        onResizeEnd={(e) => {
          dispatch(
            updateSize({
              id: e.target.id,
              w: parseFloat(e.target.style.width) * PanelState.tickUnit,
              h: parseFloat(e.target.style.height) * PanelState.tickUnit,
            })
          );
        }}
        onDragEnd={(e) => {
          console.log(e, "e-e-e-e-e-e-ecc");
          dispatch(
            updatePosition({
              id: e.target.id,
              x: parseFloat(e.target.style.left) * PanelState.tickUnit,
              y: parseFloat(e.target.style.top) * PanelState.tickUnit,
            })
          );
        }}
        onRenderGroup={(e) => {
          e.events.forEach((ev) => {
            ev.target.style.cssText += ev.cssText;
          });
        }}
      />
      {NodesState.isSelection && (
        <Selecto
          ref={selectoRef}
          dragContainer={".elements"}
          selectableTargets={[".target"]}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={["shift"]}
          ratio={0}
          keyContainer={window}
          onDragStart={(e) => {
            console.log(e, "ererererererre");
            const target = e.inputEvent.target;
            if (
              moveableRef.current!.isMoveableElement(target) ||
              NodesState.targets!.some(
                (t) => t === target || t.contains(target)
              )
            ) {
              e.stop();
            }
          }}
          onSelectEnd={(e) => {
            setTimeout(() => {
              [...document.querySelectorAll(".moveable-area")].forEach(
                (node) => {
                  node.setAttribute(ATTR_TAG, Node);
                }
              );
            }, 0);
            if (e.isDragStartEnd) {
              e.inputEvent.preventDefault();
              moveableRef.current!.waitToChangeTarget().then(() => {
                moveableRef.current!.dragStart(e.inputEvent);
              });
            }
            dispatch(updateTargets(e.selected));
          }}
        />
      )}
      <div className="empty elements"></div>
      <div className="relative w-full h-full elements">
        {[...Object.values(NodesState.list)].map((node) => {
          return <NodeSlot key={node.id} node={node}></NodeSlot>;
        })}
      </div>
    </>
  );
};

export const AScene = () => {
  const SCENE_REF = useRef<HTMLDivElement>(null);
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
            ref={SCENE_REF}
            id={SCENE}
            className="absolute bg-[#232324] overflow-hidden"
            style={{
              left: PanelState.panelLeft - PanelState.rulerMinX + "px",
              top: PanelState.panelTop - PanelState.rulerMinY + "px",
              width: PanelState.panelWidth / PanelState.tickUnit + "px",
              height: PanelState.panelHeight / PanelState.tickUnit + "px",
            }}
          >
            <NodeContainer></NodeContainer>
          </div>
        </div>
      </div>
    </>
  );
};
