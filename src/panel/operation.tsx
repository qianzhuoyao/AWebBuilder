import { useDispatch, useSelector } from "react-redux";
import { IPs } from "../store/slice/panelSlice";
import { Suspense, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { INs, IViewNode, updateTargets } from "../store/slice/nodeSlice";
import { ATTR_TAG, NODE_TYPE_CODE, NODE_ID, SCENE } from "../contant";

import { NodeContainer } from "./nodeContainer.tsx";
import { getTemplate } from "../node/baseViewNode.ts";
import { useTakeNodeData } from "../comp/useTakeNodeData.tsx";
import { useTakePanel } from "../comp/useTakeStore.tsx";

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

    const element = useMemo(
      () =>
        elementBuilder?.(NodesState.list[id], {
          isInit: !!isTemp,
          PanelState,
          NodesState,
          id,
        }) || <></>,
      [NodesState, PanelState, elementBuilder, id, isTemp]
    );

    console.log(NodesState.list[id], "elementBuildersss");
    return <Suspense fallback={<>loading</>}>{element}</Suspense>;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const PanelState = useTakePanel()
    const NodesState = useTakeNodeData()
    console.log(node, "daw3efgfgg");
    useEffect(() => {
      if (!nodeRef.current) {
        return;
      }
      [...nodeRef.current.getElementsByTagName("*")].forEach((ele) => {
        ele.setAttribute(ATTR_TAG, NODE_TYPE_CODE);
        ele.setAttribute(NODE_ID, node.id);
      });
    }, [node.id]);

    const onHandleSelectedCurrent = useCallback(() => {
      //如果不是模板 就选中，否则映射至对应组件
      console.log(isTemp, node, nodeRef, PanelState, 'isTempisTemp')
      if (isTemp) {
        dispatch(updateTargets([node.id]));
      } else {
        dispatch(updateTargets([nodeRef.current?.id]));
      }
    }, [dispatch, isTemp, node.id]);

    useEffect(() => {
      if (nodeRef.current) {
        nodeRef.current.style.left = node.x + "px";
        nodeRef.current.style.top = node.y + "px";
        nodeRef.current.style.width = node.w  + "px";
        nodeRef.current.style.height = node.h  + "px";
      }
    }, []);

    return (
      <>
        <div
          ref={nodeRef}
          id={isTemp ? node.id + "-Map" : node.id}
          className={isTemp ? `${tag}` : `absolute target ${tag}`}
          onMouseDown={onHandleSelectedCurrent}
          style={
            isTemp
              ? {
                zIndex: node.z,
                width: "100%",
                height: "100%",
              }
              : {
                zIndex: node.z,
                width: "0px",
                height: "0px",
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
      </>
    );
  }
);

export const AScene = memo(() => {
  console.log("f222f2ff2f2f2f2");
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
         
            <NodeContainer></NodeContainer>
     
        </div>
      </div>
    </>
  );
});
