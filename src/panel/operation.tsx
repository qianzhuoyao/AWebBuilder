import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import { memo, useCallback, useEffect, useRef } from "react";
import {
  INs,
  IViewNode,
  updatePosition,
  updateTargets,
} from "../store/slice/nodeSlice";
import { ATTR_TAG, NODE_TYPE_CODE, NODE_ID, SCENE } from "../contant";
import { computeActPositionNodeByRuler } from "../comp/computeActNodeByRuler.ts";

import { NodeContainer } from "./nodeContainer.tsx";
import { getTemplate } from "../node/baseViewNode.ts";

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
    const elementBuilder = getTemplate(NodesState.list[id]?.classify);
    return (
      elementBuilder?.(NodesState.list[id], {
        isInit: !!isTemp,
        PanelState,
        NodesState,
        id,
      }) || <></>
    );
  }
);

export const NodeSlot = memo(
  ({
    node,
    isTemp,
    tag,
  }: {
    tag: string;
    node: IViewNode;
    isTemp: boolean;
  }) => {
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
        ele.setAttribute(ATTR_TAG, NODE_TYPE_CODE);
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
    }, [dispatch, isTemp, node.id]);

    return (
      <div
        ref={nodeRef}
        id={isTemp ? node.id + "-Map" : node.id}
        className={isTemp ? `${tag}` : `absolute target ${tag}`}
        onMouseDown={onHandleSelectedCurrent}
        style={
          isTemp
            ? {
                width: "100%",
                height: "100%",
              }
            : {
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
