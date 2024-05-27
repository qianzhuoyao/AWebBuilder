import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Moveable, { MoveableManagerInterface } from "react-moveable";
import Selecto from "react-selecto";
import { useFilterViewNode } from "./useFilter";
import { useDispatch } from "react-redux";
import {
  deleteListItem,
  updatePosition,
  updateRotate,
  updateSize,
  updateTargets,
  updateZ,
} from "../store/slice/nodeSlice";

import { updateDraggable } from "../store/slice/widgetSlice";
import { ItemParams } from "react-contexify";
import { SCENE, SHOT_IMAGE_CONTAINER } from "../contant";
import { useSceneContext } from "../menu/context";
import { ATTR_TAG, NODE_TYPE_CODE, PANEL_MAIN_BG } from "../contant";
import { NodeSlot } from "./operation";
import { useHotkeys } from "react-hotkeys-hook";
import { IEmitter, emitBlockSubscribe } from "../emit/emitBlock";
import { useTakeNodeData } from "../comp/useTakeNodeData";
import { useTakePanel, useTakeWidget } from "../comp/useTakeStore";

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
  const boundsRef = useRef<HTMLDivElement>(null);
  const selectoRef = useRef<Selecto>(null);
  const layerViewNode = useFilterViewNode();
  const { lock } = useNodeContainerHotKeys();
  const SCENE_REF = useRef<HTMLDivElement>(null);
  const NodesState = useTakeNodeData();
  const dispatch = useDispatch();
  const PanelState = useTakePanel();
  const widgetState = useTakeWidget();
  const [deleteLock, setDeleteLock] = useState(false);
  useHotkeys("v", () => setDeleteLock(true), { keyup: false, keydown: true });
  useHotkeys("v", () => setDeleteLock(false), { keyup: true, keydown: false });
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
            {`长:${Math.floor(
              rect.width * PanelState.tickUnit
            )};高:${Math.floor(rect.height * PanelState.tickUnit)};X:${
              rect.left * PanelState.tickUnit
            };Y:${rect.top * PanelState.tickUnit}`}
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
    },
    [dispatch]
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

  const getPosition = useCallback(
    (param: IEmitter) => {
      return {
        x: Math.floor((param.pack?.x || 0) / PanelState.tickUnit),
        y: Math.floor((param.pack?.y || 0) / PanelState.tickUnit),
      };
    },
    [PanelState.tickUnit]
  );

  useEffect(() => {
    const sub = emitBlockSubscribe((param) => {
      if (param.type === "render") {
        moveableRef.current?.updateRect();
      } else if (param.type === "positionChange") {
        moveableRef.current!.request("draggable", getPosition(param), true);
        moveableRef.current?.updateRect();
      } else if (param.type === "hideBox") {
        const box = moveableRef.current?.getControlBoxElement();
        if (box) {
          box.style.visibility = "hidden";
        }
      } else if (param.type === "displayBox") {
        const box = moveableRef.current?.getControlBoxElement();

        if (box) {
          box.style.visibility = "visible";
        }
      } else if (param.type === "sizeChange") {
        moveableRef.current!.request(
          "resizable",
          {
            offsetWidth: param.pack?.w || 0,
            offsetHeight: param.pack?.h || 0,
          },
          true
        );
        moveableRef.current?.updateRect();
      } else if (param.type === "rotateChange") {
        moveableRef.current!.request(
          "rotatable",
          {
            rotate: param.pack?.rotate || 0,
          },
          true
        );
        moveableRef.current?.updateRect();
      } else if (param.type === "ZIndexChange") {
        const box = moveableRef.current?.getControlBoxElement();

        if (param.pack?.id && document.getElementById(param.pack.id)) {
          (document.getElementById(param.pack.id) as HTMLElement).style.zIndex =
            String(param.pack?.zIndex) || "1";
        }
        if (box) {
          box.style.zIndex = String(param.pack?.zIndex) || "1";
        }
        moveableRef.current?.updateRect();
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [PanelState.tickUnit, getPosition, hideBox]);

  useEffect(() => {
    console.log(SCENE_REF.current?.getBoundingClientRect(), "cw3cwcw22");
    if (boundsRef.current instanceof HTMLElement) {
      // boundsRef.current.style.left = SCENE_REF.current?.getBoundingClientRect().left + 'px'
      // boundsRef.current.style.top = SCENE_REF.current?.getBoundingClientRect().top + 'px'
      boundsRef.current.style.width =
        SCENE_REF.current?.getBoundingClientRect().width + "px";
      boundsRef.current.style.height =
        SCENE_REF.current?.getBoundingClientRect().height + "px";
    }
  }, [
    PanelState.panelHeight,
    PanelState.panelLeft,
    PanelState.panelTop,
    PanelState.panelWidth,
    PanelState.tickUnit,
  ]);

  const onHandleFocus = useCallback(() => {
    const box = moveableRef.current?.getControlBoxElement();

    if (box) {
      box.style.overflow = "visible";
    }
  }, []);

  return (
    <div
      ref={boundsRef}
      id={SHOT_IMAGE_CONTAINER}
      className="absolute"
      style={{
        left: PanelState.panelLeft - PanelState.rulerMinX + "px",
        top: PanelState.panelTop - PanelState.rulerMinY + "px",
      }}
    >
      <Moveable
        ref={moveableRef}
        origin={false}
        throttleDrag={1}
        keepRatio={false}
        target={NodesState.targets?.map((id) => document.getElementById(id))}
        draggable={widgetState.inOperationForDraggable}
        resizable={true}
        scalable={true}
        snappable={true}
        rotatable={true}
        isDisplaySnapDigit={true}
        isDisplayInnerSnapDigit={true}
        snapGap={true}
        snapDigit={5}
        verticalGuidelines={PanelState.verticalGuidelines.map((i) => {
          return {
            pos: i / PanelState.tickUnit,
          };
        })}
        horizontalGuidelines={PanelState.horizontalGuidelines.map((i) => {
          return {
            pos: i / PanelState.tickUnit,
          };
        })}
        snapRenderThreshold={5}
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
        }}
        onRender={(e) => {
          e.target.style.cssText += e.cssText;
        }}
        onResizeEnd={(e) => {
          const rect = e.moveable.getRect();
          dispatch(
            updateSize({
              id: e.target.id,
              w: rect.width * PanelState.tickUnit,
              h: rect.height * PanelState.tickUnit,
            })
          );
        }}
        onDragEnd={(e) => {
          const rect = e.moveable.getRect();
          console.log(rect, "reddddd");
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
        selectFromInside={true}
        toggleContinueSelect={null}
        ratio={0}
        keyContainer={window}
        onDragStart={(e) => {
          if (!lock) {
            e.preventDrag();
          }
          console.log(selectoRef.current, e, "efgeggegegegeg");
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
      <div
        ref={SCENE_REF}
        id={SCENE}
        className="absolute bg-[#232324] overflow-hidden"
        style={{
          top: "0px",
          left: "0px",
          width: PanelState.panelWidth + "px",
          height: PanelState.panelHeight + "px",
          transform: `scale(${1 / PanelState.tickUnit},${
            1 / PanelState.tickUnit
          })`,
          transformOrigin: "top left",
        }}
      >
        <div className="empty elements"></div>
        <div
          id={PANEL_MAIN_BG}
          className="relative w-full h-full elements"
          style={{
            backgroundColor: PanelState.panelColor,
            backgroundImage: `url(${PanelState.panelBgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          {layerViewNode.map((node) => {
            return (
              <div
                key={node.id}
                onClick={onHandleFocus}
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
      </div>
      {!deleteLock &&
        view(
          ["删除", "下降层级", "上升层级"].map((value) => {
            return <div key={value}>{value}</div>;
          })
        )}
    </div>
  );
});
