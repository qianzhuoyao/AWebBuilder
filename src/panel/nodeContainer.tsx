import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Moveable, { MoveableManagerInterface } from "react-moveable";
import Selecto from "react-selecto";
import { useFilterViewNode } from "./useFilter";
import { useDispatch, useSelector } from "react-redux";
import {
  INs,
  deleteListItem,
  updatePosition,
  updateRotate,
  updateSize,
  updateTargets,
  updateZ,
} from "../store/slice/nodeSlice";
import { IPs } from "../store/slice/panelSlice";
import { IWls, updateDraggable } from "../store/slice/widgetSlice";
import { ItemParams } from "react-contexify";
import {
  RECORD_VIEW_NODE,
  recordChange,
} from "../store/slice/viewNodesRecordSlice";
import { useSceneContext } from "../menu/context";
import { ATTR_TAG, NODE_TYPE_CODE, PANEL_MAIN_BG } from "../contant";
import { NodeSlot } from "./operation";
import { useHotkeys } from "react-hotkeys-hook";
import { emitBlockSubscribe } from "../emit/emitBlock";

const useNodeContainerHotKeys = () => {
  const [lock, setLock] = useState(false);
  const dispatch = useDispatch();
  useHotkeys(
    "w",
    () => {
      setLock(true);
    },
    { keyup: false, keydown: true }
  );
  useHotkeys(
    "w",
    () => {
      setLock(false);
    },
    { keyup: true, keydown: false }
  );

  useHotkeys(
    "v",
    () => {
      dispatch(updateDraggable(false));
    },
    { keyup: false, keydown: true }
  );
  useHotkeys(
    "v",
    () => {
      dispatch(updateDraggable(true));
    },
    { keyup: true, keydown: false }
  );

  useHotkeys(
    "s",
    () => {
      dispatch(updateDraggable(false));
    },
    { keyup: false, keydown: true }
  );
  useHotkeys(
    "s",
    () => {
      dispatch(updateDraggable(true));
    },
    { keyup: true, keydown: false }
  );
  return {
    lock,
  };
};

export const NodeContainer = memo(() => {
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);
  const layerViewNode = useFilterViewNode();
  const { lock } = useNodeContainerHotKeys();

  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
  });
  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });

  const DimensionViewable = useMemo(
    <T,>() => ({
      name: "dimensionViewable",
      props: [],
      events: [],
      render(moveable: MoveableManagerInterface<T, T>) {
        const rect = moveable.getRect();
        return (
          <div
            key={"dimension-viewer"}
            className={"moveable-dimension"}
            style={{
              position: "absolute",
              left: `${rect.width / 2}px`,
              top: `${rect.height + 20}px`,
              background: "#4af",
              borderRadius: "2px",
              padding: "2px 4px",
              color: "white",
              fontSize: "13px",
              whiteSpace: "nowrap",
              fontWeight: "bold",
              willChange: "transform",
              transform: `translate(-50%, 0px)`,
            }}
          >
            {Math.round(rect.offsetWidth) * PanelState.tickUnit} x
            {Math.round(rect.offsetHeight) * PanelState.tickUnit}
          </div>
        );
      },
    }),
    [PanelState.tickUnit]
  );

  const downZIndexViewNode = useCallback((params: ItemParams) => {
    dispatch(
      updateZ({
        zIndex: params.props.z - 1,
        id: params.props.id,
      })
    );
  }, []);
  const upZIndexViewNode = useCallback((params: ItemParams) => {
    dispatch(
      updateZ({
        zIndex: params.props.z + 1,
        id: params.props.id,
      })
    );
  }, []);

  const removeViewNode = useCallback(
    (params: ItemParams) => {
      dispatch(deleteListItem({ idList: [params.props.id] }));
      dispatch(
        recordChange({
          recordViewType: RECORD_VIEW_NODE,
          recordDesc: "删除了一个视图组件,别名为" + params.props.alias,
          recordViewInfo: NodesState.list,
        })
      );
    },
    [NodesState.list]
  );

  const { view, show } = useSceneContext("viewNode", (params) => {
    switch ((params.event.target as HTMLElement)?.innerText) {
      case "删除":
        return removeViewNode(params);
      case "下降层级":
        return downZIndexViewNode(params);
      case "上升层级":
        return upZIndexViewNode(params);
    }
  });
  const dispatch = useDispatch();

  const hideBox = useCallback(() => {
    const box = moveableRef.current?.getControlBoxElement();
    if (box) {
      box.style.display = "none";
    }
  }, []);

  useEffect(() => {
    const box = moveableRef.current?.getControlBoxElement();
    if (box) {
      box.style.zIndex = "99999";
    }
  }, []);

  useEffect(() => {
    const sub = emitBlockSubscribe((param) => {
      if (param.type === "render") {
        console.log(selectoRef, moveableRef, "cwecwcwccwcwcwcw");
        hideBox();
      } else if (param.type === "positionChange") {
        moveableRef.current!.request(
          "draggable",
          {
            x: param.pack?.x || 0,
            y: param.pack?.y || 0,
          },
          true
        );
      } else if (param.type === "sizeChange") {
        moveableRef.current!.request(
          "resizable",
          {
            offsetWidth: (param.pack?.w || 0) / PanelState.tickUnit,
            offsetHeight: (param.pack?.h || 0) / PanelState.tickUnit,
          },
          true
        );
      } else if (param.type === "rotateChange") {
        moveableRef.current!.request(
          "rotatable",
          {
            rotate: param.pack?.rotate || 0,
          },
          true
        );
      } else if (param.type === "ZIndexChange") {
        const box = moveableRef.current?.getControlBoxElement();

        if (param.pack?.id && document.getElementById(param.pack.id)) {
          (document.getElementById(param.pack.id) as HTMLElement).style.zIndex =
            String(param.pack?.zIndex) || "1";
        }
        if (box) {
          box.style.zIndex = String(param.pack?.zIndex) || "1";
        }
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [PanelState.tickUnit]);

  return (
    <>
      <Moveable
        ref={moveableRef}
        origin={false}
        throttleDrag={1}
        keepRatio={false}
        target={NodesState.targets.map((id) => document.getElementById(id))}
        draggable={widgetState.inOperationForDraggable}
        resizable={true}
        scalable={true}
        snappable={true}
        rotatable={true}
        isDisplaySnapDigit={true}
        isDisplayInnerSnapDigit={true}
        snapGap={true}
        snapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        ables={[DimensionViewable]}
        elementSnapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        props={{
          dimensionViewable: true,
        }}
        bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }}
        snapThreshold={1}
        maxSnapElementGuidelineDistance={1}
        elementGuidelines={[".target"]}
        onDragStart={() => {}}
        onClickGroup={(e) => {
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onRotateEnd={(e) => {
          dispatch(
            updateRotate({
              id: e.target.id,
              rotate: e.lastEvent.absoluteRotate,
            })
          );
          setTimeout(() => {
            dispatch(
              recordChange({
                recordViewType: RECORD_VIEW_NODE,
                recordDesc: `将${NodesState.list[e.target.id].alias}旋转了${
                  e.lastEvent.absoluteRotate
                }度`,
                recordViewInfo: {
                  ...NodesState.list,
                  [e.target.id]: {
                    ...NodesState.list[e.target.id],
                    r: e.lastEvent.absoluteRotate,
                  },
                },
              })
            );
          }, 0);
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
          setTimeout(() => {
            dispatch(
              recordChange({
                recordViewType: RECORD_VIEW_NODE,
                recordDesc: `将${NodesState.list[e.target.id].alias}放大到 长:${
                  parseFloat(e.target.style.width) * PanelState.tickUnit
                }px,宽:${
                  parseFloat(e.target.style.height) * PanelState.tickUnit
                }px`,
                recordViewInfo: {
                  ...NodesState.list,
                  [e.target.id]: {
                    ...NodesState.list[e.target.id],
                    w: parseFloat(e.target.style.width) * PanelState.tickUnit,
                    h: parseFloat(e.target.style.height) * PanelState.tickUnit,
                  },
                },
              })
            );
          }, 0);
        }}
        onDragEnd={(e) => {
          const rect = e.moveable.getRect();
          dispatch(
            updatePosition({
              id: e.target.id,
              x: rect.left * PanelState.tickUnit,
              y: rect.top * PanelState.tickUnit,
            })
          );
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
        onRotate={(e) => {
          e.target.style.transform = e.drag.transform;
        }}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        onRenderGroup={(e) => {
          e.events.forEach((ev) => {
            ev.target.style.cssText += ev.cssText;
          });
        }}
      />

      <Selecto
        ref={selectoRef}
        dragContainer={".elements"}
        selectableTargets={[".target"]}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        toggleContinueSelect={null}
        ratio={0}
        keyContainer={window}
        onDragStart={(e) => {
          if (!lock) {
            e.preventDrag();
          }
          console.log(e, "efgeggegegegeg");
          const target = e.inputEvent.target;
          if (
            moveableRef.current!.isMoveableElement(target) ||
            NodesState.targets
              .map((id) => {
                return document.getElementById(id);
              })!
              .some((t) => t === target || t?.contains(target))
          ) {
            e.stop();
          }
        }}
        onSelectEnd={(e) => {
          setTimeout(() => {
            [...document.querySelectorAll(".moveable-area")].forEach((node) => {
              node.setAttribute(ATTR_TAG, NODE_TYPE_CODE);
            });
          }, 0);
          if (e.isDragStartEnd) {
            e.inputEvent.preventDefault();
            moveableRef.current!.waitToChangeTarget().then(() => {
              moveableRef.current!.dragStart(e.inputEvent);
            });
          }
          dispatch(updateTargets(e.selected.map((node) => node.id)));
        }}
      />
      <div className="empty elements"></div>
      <div
        id={PANEL_MAIN_BG}
        className="relative w-full h-full elements"
        style={{
          background: PanelState.panelColor,
        }}
      >
        {layerViewNode.map((node) => {
          return (
            <div
              key={node.id}
              onContextMenu={(e) => {
                show({
                  event: e,
                  props: node,
                });
              }}
            >
              <NodeSlot
                tag=""
                key={node.id}
                node={node}
                isTemp={false}
              ></NodeSlot>
            </div>
          );
        })}
      </div>
      {view(
        ["删除", "下降层级", "上升层级"].map((value) => {
          return <div key={value}>{value}</div>;
        })
      )}
    </>
  );
});
