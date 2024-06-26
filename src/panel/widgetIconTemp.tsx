import {
  Card,
  Image,
  CardFooter,
  CardHeader,
  Tooltip,
} from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import {
  memo,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { createLayerSrc, setWidgetStream } from "./createWidgetPipe";
import { useDispatch } from "react-redux";
import gsap from "gsap";
import {
  AR_PANEL_DOM_ID,
  LOGIC_PANEL_DOM_ID,
  NODE_TYPE_IN_ELE,
  NODE_TYPE_IN_ELE_LOGIC,
  NODE_TYPE_IN_ELE_VIEW,
  drag_size_height,
  drag_size_width,
} from "../contant";
import {
  IClassify,
  INodeType,
  addNode,
  logic_D_get,
  logic_Ring_get,
  logic_TO_get,
  logic_Form_get,
  logic_ENC_get,
  IViewNode,
} from "../store/slice/nodeSlice";
import { addLogicNode, ILogicNode } from "../store/slice/logicSlice";
import { toast } from "react-toastify";
import { mapNodeBindPort } from "../comp/mapNodePort.ts";
import { setDefaultChartOption } from "../comp/setDefaultChartOption.ts";
import {
  genLogicConfigMap,
  IConfigInfo,
  IRemoteReqInfo,
} from "../Logic/nodes/logicConfigMap.ts";
import { addPortNodeMap, getPortStatus } from "../node/portStatus.ts";
import { createNode } from "./logicPanelEventSubscribe.ts";
import {
  getLayerContent,
  updateLogicNodesInLayer,
  updateViewNodesInLayer,
} from "./layers.ts";

import { useTakeNodeData } from "../comp/useTakeNodeData.tsx";
import { useTakeLogicData } from "../comp/useTakeLogicData.tsx";
import {
  useTakePanel,
  useTakeWidget,
  useTakeWidgetMap,
} from "../comp/useTakeStore.tsx";

interface IW {
  nodeType: "LOGIC" | "VIEW";
  src: string;
  name: string;
  typeId: INodeType;
  classify: IClassify;
  tips?: string;
}

const isInPanel = (
  e: MouseEvent,
  parentDomId: typeof AR_PANEL_DOM_ID | typeof LOGIC_PANEL_DOM_ID
): boolean => {
  const { pageX, pageY } = e;

  const dom = document.getElementById(parentDomId);
  if (!dom) {
    return false;
  }

  const { left, top, width, height } = dom.getBoundingClientRect();

  return (
    pageX >= left &&
    pageX <= left + width &&
    pageY >= top &&
    pageY <= top + height
  );
};

const ViewCard = memo(
  ({
    name,
    typeId,
    id,
    src,
  }: {
    name: string;
    typeId: INodeType;
    id: string;
    src: string;
  }) => {
    const widgetMapState = useTakeWidgetMap();
    const ICardRef = useRef<HTMLDivElement>(null);
    const ImageRef = useRef<HTMLImageElement>(null);
    useCardDefaultSetting(
      ICardRef,
      ImageRef,
      name,
      typeId,
      widgetMapState.contentImageShowType
    );

    useEffect(() => {
      ImageRef.current?.setAttribute(NODE_TYPE_IN_ELE, NODE_TYPE_IN_ELE_VIEW);
    }, []);

    return (
      <>
        {useMemo(
          () => (
            <Card
              ref={ICardRef}
              isFooterBlurred
              radius="lg"
              className="border-none p-1 m-1 bg-default-200 cursor-pointer"
            >
              <Image
                ref={ImageRef}
                id={id}
                alt={name}
                isZoomed
                src={src}
                className={"h-[100px] w-[200px] object-fill"}
              />

              {!widgetMapState.contentImageShowType && (
                <CardFooter className="top-1 right-1 h-[20px] justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-md rounded-large bottom-1 w-[30px)] shadow-small ml-1 z-10">
                  <p className="text-tiny text-white/80">{name}</p>
                </CardFooter>
              )}
            </Card>
          ),
          [id, name, src, widgetMapState.contentImageShowType]
        )}
      </>
    );
  }
);

/**
 * 转化坐标为scene坐标
 */
const transPointInScene = (
  pageX: number,
  pageY: number,
  rMinX: number,
  rMinY: number,
  offset: number
) => {
  const SCENE = document.getElementById(AR_PANEL_DOM_ID);
  if (!SCENE) {
    return;
  }
  const { left, top } = SCENE.getBoundingClientRect();

  return {
    x: pageX - left - offset + rMinX,
    y: pageY - top - offset + rMinY,
  };
};

const useCardDefaultSetting = (
  ICardRef: React.RefObject<HTMLDivElement>,
  ImageRef: React.RefObject<HTMLImageElement>,
  name: string,
  typeId: INodeType,
  contentImageShowType: number
) => {
  ImageRef.current?.setAttribute("data-temp-type", name);
  ImageRef.current?.setAttribute("data-temp-id", typeId);
  useEffect(() => {
    if (!ICardRef.current) {
      return;
    }
    ICardRef.current.onselectstart = () => false;
    ICardRef.current.ondragstart = () => false;
  }, [ICardRef]);

  useLayoutEffect(() => {
    if (contentImageShowType) {
      gsap.to(ICardRef.current, {
        width: "44%",
        duration: 0.1,
        ease: "none",
      });
    } else {
      gsap.to(ICardRef.current, {
        width: "auto",
        duration: 0.1,
        ease: "none",
      });
    }
  }, [ICardRef, contentImageShowType]);
};

const LogicCard = memo(
  ({
    name,
    typeId,
    id,
    src,
    tips,
  }: {
    name: string;
    typeId: INodeType;
    id: string;
    src: string;
    tips?: string;
  }) => {
    const logicState = useTakeLogicData();
    const ICardRef = useRef<HTMLDivElement>(null);
    const ImageRef = useRef<HTMLImageElement>(null);
    useCardDefaultSetting(
      ICardRef,
      ImageRef,
      name,
      typeId,
      logicState.contentImageShowType
    );
    useEffect(() => {
      ImageRef.current?.setAttribute(NODE_TYPE_IN_ELE, NODE_TYPE_IN_ELE_LOGIC);
    }, []);
    return (
      <>
        {useMemo(
          () => (
            <>
              <Card ref={ICardRef} className="cursor-pointer">
                <CardHeader className="flex gap-3">
                  <Image
                    classNames={{
                      wrapper: "w-[30px]",
                    }}
                    id={id}
                    ref={ImageRef}
                    alt="logo"
                    height={30}
                    radius="sm"
                    src={src}
                    width={30}
                  />
                  <div className="flex flex-col w-[70px]">
                    <p className="text-small">{name}</p>
                    <Tooltip color={"default"} content={tips} className="">
                      <p className="text-small text-default-500 truncate">
                        {tips}
                      </p>
                    </Tooltip>
                  </div>
                </CardHeader>
              </Card>
            </>
          ),
          [id, name, src, tips]
        )}
      </>
    );
  }
);

export const defaultRemote: IRemoteReqInfo = {
  protocol: "http",
  method: "post",
  url: "",
  token: "",
};

const setDefaultInfo = (typeId: INodeType): IConfigInfo => {
  switch (typeId) {
    case logic_Ring_get:
      return {
        timerConfigInfo: {
          time: 1000,
        },
      };
    case logic_Form_get:
      return {
        formConfigInfo: {
          mergePre: false,
          json: {},
        },
      };
    case logic_TO_get:
      return {
        timerOutConfigInfo: {
          timeOut: 10000,
        },
      };
    case logic_ENC_get:
      return {
        encryptionConfigInfo: {
          encryptionMethod: "MD5",
          publicKey: "",
        },
      };
    case logic_D_get:
      return {
        remoteReqInfo: defaultRemote,
      };
    default:
      return {};
  }
};

export const WidgetIconTemp = memo(
  ({ src, name, typeId, classify, nodeType, tips }: IW) => {
    const key = useId();

    const dispatch = useDispatch();

    const PanelState = useTakePanel();
    const widgetState = useTakeWidget();
    const currentLayer = getLayerContent(widgetState.currentLayerId);

    const NodesState = useTakeNodeData();
    useEffect(() => {
      const subscription = setWidgetStream<HTMLImageElement | null, undefined>(
        key,
        {
          down: (e) => {
            const node = createLayerSrc("img");
            if (node) {
              node.src = src;
              node.style.position = "absolute";
              node.style.width = drag_size_width + "px";
              node.style.height = drag_size_height + "px";
              node.style.left = e.pageX + "px";
              node.style.top = e.pageY + "px";
              if (e.target instanceof HTMLElement) {
                node.setAttribute(
                  NODE_TYPE_IN_ELE,
                  e.target.getAttribute(NODE_TYPE_IN_ELE) || "isError"
                );
              }
            }

            return node;
          },
          move: (e, c) => {
            if (c) {
              c.style.left = e.pageX + "px";
              c.style.top = e.pageY + "px";
            }
          },
          up: (e, c) => {
            if (c?.getAttribute(NODE_TYPE_IN_ELE) === NODE_TYPE_IN_ELE_VIEW) {
              c?.remove();
              const pointer = transPointInScene(
                e.pageX,
                e.pageY,
                PanelState.rulerMinX,
                PanelState.rulerMinY,
                PanelState.offset
              );
              if (pointer && isInPanel(e, AR_PANEL_DOM_ID)) {
                const w = drag_size_width;
                const h = drag_size_height;
                const { x, y } = pointer;
                const viewNodeId = uuidv4();
                const newNodeName = name + "@" + viewNodeId;
                console.log(
                  drag_size_width,
                  drag_size_height,
                  PanelState.tickUnit,
                  "PanelState.tickUnit"
                );
                const newNode: IViewNode = {
                  x: x * PanelState.tickUnit,
                  y: y * PanelState.tickUnit,
                  r: 0,
                  w,
                  h,

                  z: 10,
                  desc: "",
                  id: viewNodeId,
                  typeId,
                  classify,
                  nodeType,
                  alias: newNodeName,
                  instance: {
                    type: typeId,
                    option: setDefaultChartOption(typeId),
                  },
                };
                dispatch(addNode(newNode));
                setTimeout(() => {
                  updateViewNodesInLayer(
                    currentLayer?.layerNameNodesOfView || "",
                    viewNodeId
                  );
                }, 0);
              } else {
                toast.error("目标面板应该是视图层");
              }
            } else if (
              c?.getAttribute(NODE_TYPE_IN_ELE) === NODE_TYPE_IN_ELE_LOGIC
            ) {
              if (isInPanel(e, LOGIC_PANEL_DOM_ID)) {
                const LOGIC_CONTAINER =
                  document.getElementById(LOGIC_PANEL_DOM_ID);
                if (!LOGIC_CONTAINER) {
                  toast.error("逻辑面板不存在,请刷新");
                  return;
                }
                const { left, top } = LOGIC_CONTAINER.getBoundingClientRect();

                //映射端点
                const Tem = mapNodeBindPort({
                  belongClass: classify,
                  typeId,
                });

                const logicId = uuidv4();

                const defaultConfigInfo = setDefaultInfo(typeId);

                //设置携带的端口状态
                // getPortStatus().status.set(logicId)
                genLogicConfigMap().configInfo.set(logicId, defaultConfigInfo);

                Tem?.ports.map((port, index) => {
                  if (port.type === "isIn") {
                    const inPortId = "in" + index + "#" + port.id;
                    addPortNodeMap(logicId, inPortId);
                    getPortStatus().status.set(inPortId, {
                      type: "in",
                      tag: index,
                      portType: "",
                      portName: port.portName,
                      pointStatus: 0,
                      id: port.id,
                    });
                  } else {
                    const outPortId = "out" + index + "#" + port.id;
                    // getPortStatus().nodePortMap.set(logicId).;
                    addPortNodeMap(logicId, outPortId);
                    getPortStatus().status.set(outPortId, {
                      type: "out",
                      tag: index,
                      portType: "",
                      portName: port.portName,
                      pointStatus: 0,
                      id: port.id,
                    });
                  }
                });
                //widgetMapState

                createNode({
                  typeId,
                  belongClass: classify,
                  x: e.pageX - left,
                  y: e.pageY - top,
                  shape: "image",
                  width: 40,
                  height: 40,
                  id: logicId,
                  imageUrl: c.src,
                } as ILogicNode);
                dispatch(
                  addLogicNode({
                    typeId,
                    belongClass: classify,
                    x: e.pageX - left,
                    y: e.pageY - top,
                    shape: "image",
                    width: 40,
                    height: 40,
                    id: logicId,
                    imageUrl: c.src,
                  })
                );

                setTimeout(() => {
                  updateLogicNodesInLayer(
                    currentLayer?.layerNameNodesOfLogic || "",
                    logicId
                  );
                }, 0);
              } else {
                toast.error("目标面板应该是逻辑层");
              }
              c?.remove();
            } else {
              throw new Error("handler htmlELe is unknown");
            }
          },
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }, [
      NodesState,
      PanelState.offset,
      PanelState.rulerMinX,
      PanelState.rulerMinY,
      PanelState.tickUnit,
      classify,
      currentLayer?.layerNameNodesOfLogic,
      currentLayer?.layerNameNodesOfView,
      dispatch,
      key,
      name,
      nodeType,
      src,
      typeId,
    ]);

    return (
      <>
        {nodeType === "VIEW" ? (
          <ViewCard id={key} name={name} typeId={typeId} src={src} />
        ) : (
          <LogicCard
            name={name}
            id={key}
            typeId={typeId}
            src={src}
            tips={tips}
          />
        )}
      </>
    );
  }
);
