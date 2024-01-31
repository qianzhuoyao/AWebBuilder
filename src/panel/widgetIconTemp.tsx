import { Card, Image, CardFooter } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import { FC, useEffect, useId, useLayoutEffect, useRef } from "react";
import { createLayerSrc, setWidgetStream } from "./createWidgetPipe";
import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import gsap from "gsap";
import { AR_PANEL_DOM_ID, drag_size_height, drag_size_width } from "../contant";
import { IClassify, INodeType, addNode } from "../store/slice/nodeSlice";
import { IWs } from "../store/slice/widgetMapSlice";

interface IW {
  src: string;
  name: string;
  typeId: INodeType;
  classify: IClassify;
}

/**
 * 转化坐标为scene坐标
 */
export const transPointInScene = (
  pageX: number,
  pageY: number,
  rMinX: number,
  rMinY: number,
  tickUnit: number,
  offset: number
) => {
  const SCENE = document.getElementById(AR_PANEL_DOM_ID);
  if (!SCENE) {
    return;
  }
  const { left, top } = SCENE.getBoundingClientRect();
  console.log(
    pageX - left - offset + rMinX,
    rMinX,
    { left, top, pageX, pageY, rMinX, rMinY, tickUnit },
    "{ left, top }"
  );
  return {
    x: pageX - left - offset + rMinX,
    y: pageY - top - offset + rMinY,
  };
};

export const WidgetIconTemp: FC<IW> = ({ src, name, typeId, classify }) => {
  const ICardRef = useRef<HTMLDivElement>(null);
  const ImageRef = useRef<HTMLImageElement>(null);
  const key = useId();

  const dispatch = useDispatch();

  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    console.log(state, "statescvsfv");
    return state.panelSlice;
  });

  useEffect(() => {
    ImageRef.current?.setAttribute("data-temp-type", name);
    ImageRef.current?.setAttribute("data-temp-id", typeId);
    if (!ICardRef.current) {
      return;
    }
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
        console.log(e, "down");
        return node;
      },
      move: (e, c) => {
        console.log(e, c, "move");
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
          PanelState.tickUnit,
          PanelState.offset
        );
        if (pointer) {
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
              alias: name + typeId,
              instance: {
                type: typeId,
              },
            })
          );
        }
      },
    });
    ICardRef.current.onselectstart = () => false;
    ICardRef.current.ondragstart = () => false;
    return () => {
      subscription?.unsubscribe();
    };
  }, [PanelState, classify, dispatch, key, name, src, typeId]);

  const widgetMapState = useSelector((state: { widgetMapSlice: IWs }) => {
    return state.widgetMapSlice;
  });

  useLayoutEffect(() => {
    if (widgetMapState.contentImageShowType) {
      gsap.to(ICardRef.current, {
        width: "44%",
        duration: 0.1,
        ease: "none",
      });
    } else {
      gsap.to(ICardRef.current, {
        width: "100%",
        duration: 0.1,
        ease: "none",
      });
    }
  }, [widgetMapState]);

  return (
    <Card
      ref={ICardRef}
      isFooterBlurred
      radius="lg"
      className="border-none p-1 m-1 bg-default-200 cursor-pointer"
    >
      <Image
        ref={ImageRef}
        id={key}
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
  );
};
