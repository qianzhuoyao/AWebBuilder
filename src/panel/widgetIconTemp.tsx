import { Card, Image, CardFooter, CardHeader } from "@nextui-org/react";
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
import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import gsap from "gsap";
import { AR_PANEL_DOM_ID, drag_size_height, drag_size_width } from "../contant";
import { IClassify, INodeType, addNode } from "../store/slice/nodeSlice";
import { IWs } from "../store/slice/widgetMapSlice";
import { ILs } from "../store/slice/logicSlice";

interface IW {
  nodeType: "LOGIC" | "VIEW";
  src: string;
  name: string;
  typeId: INodeType;
  classify: IClassify;
  tips?: string;
}

const isInPanel = (e: MouseEvent): boolean => {
  const { pageX, pageY } = e;

  const dom = document.getElementById(AR_PANEL_DOM_ID);
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
    const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
      return state.widgetMapSlice;
    });
    const ICardRef = useRef<HTMLDivElement>(null);
    const ImageRef = useRef<HTMLImageElement>(null);
    useCardDefaultSetting(
      ICardRef,
      ImageRef,
      name,
      typeId,
      widgetMapState.contentImageShowType
    );
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
                className="object-cover"
                height={200}
                isZoomed
                src={src}
                width={"100%"}
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
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });
    const ICardRef = useRef<HTMLDivElement>(null);
    const ImageRef = useRef<HTMLImageElement>(null);
    useCardDefaultSetting(
      ICardRef,
      ImageRef,
      name,
      typeId,
      logicState.contentImageShowType
    );

    return (
      <>
        {useMemo(
          () => (
            <>
              <Card ref={ICardRef} className="cursor-pointer">
                <CardHeader className="flex gap-3">
                  <Image
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
                    <p className="text-small text-default-500 truncate">
                      {tips}
                    </p>
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

export const WidgetIconTemp = memo(
  ({ src, name, typeId, classify, nodeType, tips }: IW) => {
    const key = useId();

    const dispatch = useDispatch();

    const PanelState = useSelector((state: { panelSlice: IPs }) => {
      return state.panelSlice;
    });

    useEffect(() => {
      const subscription = setWidgetStream<HTMLElement | null, undefined>(key, {
        down: (e) => {
          const node = createLayerSrc("img");
          if (node) {
            node.src = src;
            node.style.position = "absolute";
            node.style.width = drag_size_width + "px";
            node.style.height = drag_size_height + "px";
            node.style.left = e.pageX + "px";
            node.style.top = e.pageY + "px";
          }

          return node;
        },
        move: (e, c) => {
          console.log(e, "streams");
          if (c) {
            c.style.left = e.pageX + "px";
            c.style.top = e.pageY + "px";
          }
        },
        up: (e, c) => {
          c?.remove();
          const pointer = transPointInScene(
            e.pageX,
            e.pageY,
            PanelState.rulerMinX,
            PanelState.rulerMinY,
            PanelState.offset
          );
          if (pointer && isInPanel(e)) {
            const w = drag_size_width * PanelState.tickUnit;
            const h = drag_size_height * PanelState.tickUnit;
            const { x, y } = pointer;
            dispatch(
              addNode({
                x: x * PanelState.tickUnit,
                y: y * PanelState.tickUnit,
                w,
                h,
                z: 10,
                id: uuidv4(),
                classify,
                nodeType,
                alias: name + typeId,
                instance: {
                  type: typeId,
                },
              })
            );
          }
        },
      });

      return () => {
        subscription?.unsubscribe();
      };
    }, [
      PanelState.offset,
      PanelState.rulerMinX,
      PanelState.rulerMinY,
      PanelState.tickUnit,
      classify,
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
