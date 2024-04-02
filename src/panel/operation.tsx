import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Moveable, { MoveableManagerInterface, Renderer } from "react-moveable";
import Selecto from "react-selecto";
import {
  deleteListItem,
  INodeType,
  INs,
  IViewNode,
  moveNode,
  pic_Img,
  pix_BX,
  pix_Table,
  resizeNode,
  updatePosition,
  updateRotate,
  updateSize,
  updateTargets,
} from "../store/slice/nodeSlice";
import { ATTR_TAG, Node, NODE_ID, PANEL_MAIN_BG, SCENE } from "../contant";
import { BaseChart } from "../node/chart";
import { useSceneContext } from "../menu/context";
import { computeActPositionNodeByRuler } from "../comp/computeActNodeByRuler.ts";
import { ItemParams } from "react-contexify";
import { useFilterViewNode } from "./useFilter.tsx";
import { getWCache, subscribeViewCacheUpdate } from "./data.ts";
import { viewUpdateReducer } from "../emit/emitChart.ts";
import { ATable } from "../comp/ATable";
import { IWls } from "../store/slice/widgetSlice.ts";
import { Image } from "@nextui-org/react";
import { runChartOption } from "../comp/useChartOption.tsx";
import {
  RECORD_VIEW_NODE,
  recordChange,
} from "../store/slice/viewNodesRecordSlice.ts";

const BaseImage = memo(({ config }: { config: IViewNode }) => {
  return (
    <Image
      width={"100%"}
      height={"100%"}
      alt="BaseImage"
      className={"w-full h-full"}
      src={config.instance.option?.src}
      classNames={{
        wrapper: "w-full h-full",
      }}
    ></Image>
  );
});

const MemoChart = memo(
  ({
    type,
    node,
    isTemp,
    tickUnit,
    parseOption,
  }: {
    type: INodeType;
    node: IViewNode;
    isTemp: boolean | undefined;
    tickUnit: number;
    parseOption: string;
  }) => (
    <>
      {useMemo(
        () => (
          <BaseChart
            type={type}
            width={isTemp ? 205 : node.w / tickUnit}
            height={isTemp ? 100 : node.h / tickUnit}
            options={runChartOption(node.id, parseOption)}
          />
        ),
        [parseOption]
      )}
    </>
  )
);

export const Temp = memo(
  ({
    id,
    isTemp,
    PanelState,
    NodesState,
  }: {
    NodesState: INs;
    id: string;
    isTemp?: boolean;
    PanelState: IPs;
  }) => {
    const [parseOptionString, setParseOptionString] = useState(
      () => (NodesState?.list || {})[id]?.instance?.option?.chart || ""
    );

    useEffect(() => {
      const sub = viewUpdateReducer(id, (payload) => {
        setParseOptionString(payload.payload);
      });
      const cacheSub = subscribeViewCacheUpdate(() => {
        if (NodesState?.list) {
          setParseOptionString(
            (NodesState?.list || {})[id]?.instance?.option?.chart || ""
          );
        }
      });
      return () => {
        sub.unsubscribe();
        cacheSub.unsubscribe();
      };
    }, [NodesState, id]);
    console.log(NodesState, "NodesState09");
    if (NodesState.list[id]?.classify === pix_BX) {
      return (
        <MemoChart
          type={NodesState.list[id].instance.type}
          node={NodesState.list[id]}
          isTemp={isTemp}
          tickUnit={PanelState.tickUnit}
          parseOption={parseOptionString}
        />
      );
    } else if (NodesState.list[id]?.classify === pix_Table) {
      return (
        <div className={"overflow-scroll w-full h-full"}>
          <ATable id={id} streamData={getWCache(id)}></ATable>
        </div>
      );
    } else if (NodesState.list[id]?.classify === pic_Img) {
      return (
        <div className={"w-full h-full"}>
          <BaseImage config={NodesState.list[id]}></BaseImage>
        </div>
      );
    }

    return <></>;
  }
);

export const NodeSlot = memo(
  ({ node, isTemp }: { node: IViewNode; isTemp: boolean }) => {
    const nodeRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const PanelState = useSelector((state: { panelSlice: IPs }) => {
      return state.panelSlice;
    });
    const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
      return state.viewNodesSlice;
    });

    useEffect(() => {
      if (nodeRef.current) {
        const pos = computeActPositionNodeByRuler(
          nodeRef.current,
          PanelState.tickUnit
        );

        if (pos) {
          dispatch(
            updatePosition({
              id: nodeRef.current.id,
              x: pos.x,
              y: pos.y,
            })
          );
          nodeRef.current.style.left = node.x / PanelState.tickUnit + "px";
          nodeRef.current.style.top = node.y / PanelState.tickUnit + "px";
        }
      }
    }, []);

    useEffect(() => {
      if (!nodeRef.current) {
        return;
      }
      [...nodeRef.current.getElementsByTagName("*")].forEach((ele) => {
        ele.setAttribute(ATTR_TAG, Node);
        ele.setAttribute(NODE_ID, node.id);
      });
    }, [NodesState]);

    const onHandleSelectedCurrent = useCallback(() => {
      //如果不是模板 就选中，否则映射至对应组件

      if (isTemp) {
        dispatch(updateTargets([node.id]));
      } else {
        dispatch(updateTargets([nodeRef.current?.id]));
      }
    }, [isTemp, node.id]);
    console.log(node, "nodes4");
    return (
      <div
        ref={nodeRef}
        id={isTemp ? node.id + "-Map" : node.id}
        className={isTemp ? "" : "absolute target"}
        onMouseDown={onHandleSelectedCurrent}
        style={
          isTemp
            ? {
                width: "100%",
                height: "100%",
              }
            : {
                // left: node.x / PanelState.tickUnit + "px",
                // top: node.y / PanelState.tickUnit + "px",
                // transform: node.transform,
                width: node.w / PanelState.tickUnit + "px",
                height: node.h / PanelState.tickUnit + "px",
              }
        }
      >
        <Temp
          id={node.id}
          isTemp={isTemp}
          PanelState={PanelState}
          NodesState={NodesState}
        ></Temp>
      </div>
    );
  }
);

const NodeContainer = memo(() => {
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);
  const layerViewNode = useFilterViewNode();
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
    () => ({
      name: "dimensionViewable",
      props: [],
      events: [],
      render(moveable: MoveableManagerInterface<any, any>) {
        const rect = moveable.getRect();

        // Add key (required)
        // Add class prefix moveable-(required)
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

  const removeViewNode = useCallback((params: ItemParams) => {
    console.log(params, ";params");
    dispatch(deleteListItem({ idList: [params.props.id] }));
    dispatch(
      recordChange({
        recordViewType: RECORD_VIEW_NODE,
        recordDesc: "删除了一个视图组件,别名为" + params.props.alias,
        recordViewInfo: NodesState.list,
      })
    );
  }, []);

  const { view, show } = useSceneContext("viewNode", (params) => {
    switch ((params.event.target as HTMLElement)?.innerText) {
      case "删除":
        return removeViewNode(params);
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (NodesState.resizeTo.length) {
      NodesState.resizeTo.map((willResizeNode) => {
        const nodeDom = document.getElementById(willResizeNode.id);
        if (nodeDom && moveableRef.current) {
          nodeDom.style.width =
            willResizeNode.newW / PanelState.tickUnit + "px";
          nodeDom.style.height =
            willResizeNode.newH / PanelState.tickUnit + "px";
          moveableRef.current!.moveable.updateTarget();
          dispatch(
            updateSize({
              id: willResizeNode.id,
              w: willResizeNode.newW,
              h: willResizeNode.newH,
            })
          );
        }
      });
      dispatch(resizeNode([]));
    }
  }, [NodesState.resizeTo, PanelState.tickUnit]);

  useEffect(() => {
    if (NodesState.moveTo.length) {
      NodesState.moveTo.map((willMoveNode) => {
        const nodeDom = document.getElementById(willMoveNode.id);
        if (nodeDom && moveableRef.current) {
          nodeDom.style.left = willMoveNode.newX / PanelState.tickUnit + "px";
          nodeDom.style.top = willMoveNode.newY / PanelState.tickUnit + "px";
          moveableRef.current!.moveable.updateTarget();
          dispatch(
            updatePosition({
              id: willMoveNode.id,
              x: willMoveNode.newX,
              y: willMoveNode.newY,
            })
          );
        }
      });
      //重置位移任务
      dispatch(moveNode([]));
    }
  }, [NodesState.moveTo, PanelState.tickUnit, dispatch]);

  useEffect(() => {
    const box = moveableRef.current?.getControlBoxElement();
    if (box) {
      box.style.zIndex = "9";
    }
  }, []);

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
        isDisplayInnerSnapDigit={false}
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
        onDragStart={(e) => {
          console.log(e, "onDragStarsst");
        }}
        onClickGroup={(e) => {
          console.log(e, "onClickGroup");
          selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
        }}
        onRotateEnd={(e) => {
          console.log(e, "eeeonRotateEndeeee");
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
          console.log(e, "renderaaa");
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
          console.log(e?.lastEvent, "onDragEnd");
          const pos = computeActPositionNodeByRuler(
            e.target,
            PanelState.tickUnit
          );
          if (pos) {
            dispatch(
              updatePosition({
                id: e.target.id,
                x: pos.x,
                y: pos.y,
                transform: e?.lastEvent?.transform,
              })
            );
            setTimeout(() => {
              console.log(NodesState, "NodesStatess3");
              dispatch(
                recordChange({
                  recordViewType: RECORD_VIEW_NODE,
                  recordDesc: `将${
                    NodesState.list[e.target.id].alias
                  }拖动至 X:${pos.x}px,Y:${pos.y}px`,
                  recordViewInfo: {
                    ...NodesState.list,
                    [e.target.id]: {
                      ...NodesState.list[e.target.id],
                      x: pos.x,
                      y: pos.y,
                    },
                  },
                })
              );
            }, 0);
          } else {
            throw new Error("computeActPositionNodeByRuler error");
          }
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
      {PanelState.isSelection && (
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
            console.log(e, "{}ddfff");
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
            dispatch(updateTargets(e.selected.map((node) => node.id)));
          }}
        />
      )}
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
              <NodeSlot key={node.id} node={node} isTemp={false}></NodeSlot>
            </div>
          );
        })}
      </div>
      {view(
        ["删除"].map((value) => {
          return <div key={value}>{value}</div>;
        })
      )}
    </>
  );
});

export const AScene = memo(() => {
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
});
