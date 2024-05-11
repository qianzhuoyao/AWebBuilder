//预览
import { Temp } from "../panel/operation.tsx";
import { useCallback, useEffect, useRef } from "react";
import { nodeBuilder } from "../Logic/nodes";
import { CONSTANT_DEMO_PATH, DEMO_LOCALSTORAGE } from "../contant";
import { genWDGraph } from "../DirGraph/weightedDirectedGraph.ts";
import { parseMakeByFromId } from "../comp/signal3.ts";
import { createNode } from "../panel/logicPanelEventSubscribe.ts";
import { ILogicNode } from "../store/slice/logicSlice.ts";
import { addNode, clear, INs, IViewNode } from "../store/slice/nodeSlice.ts";
import { useDispatch } from "react-redux";
import { genLogicConfigMapToParse } from "../Logic/nodes/logicConfigMap.ts";
import { templateMain } from "../node/index.ts";
import { useLocation, useSearchParams } from "react-router-dom";
import { loop } from "../comp/loop.ts";
import { IPs } from "../store/slice/panelSlice.ts";
import { useTakeNodeData } from "../comp/useTakeNodeData.tsx";

interface ICurrentData {
  LOGIC: {
    C: string;
    N: string;
    G: string;
  };
  PANEL: IPs;
  NODE: {
    list: IViewNode;
  };
}

export const Demo = () => {
  const indexRef = useRef<{
    index: number;
    currentData: ICurrentData | null;
  }>({
    index: 0,
    currentData: null,
  });
  const [search] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const NodesState = useTakeNodeData()
  const localStorageDataJSON = window.localStorage.getItem(DEMO_LOCALSTORAGE);
  const localStorageData = JSON.parse(localStorageDataJSON || "{}");
  const params = JSON.parse(search.get("work") || "{}");
  const pathList = params?.indexList || [];
  indexRef.current.currentData =
    localStorageData[pathList[indexRef.current.index]];
  const draw = useCallback(
    (currentData: ICurrentData | null) => {
      console.log(currentData, "useCallback");
      if (location.pathname + "/" === CONSTANT_DEMO_PATH && currentData) {
        genLogicConfigMapToParse(currentData?.LOGIC?.C || "{}");

        (
          Object.values(
            JSON.parse(currentData?.LOGIC?.N || "{}")
          ) as ILogicNode[]
        )?.map((node) => {
          createNode({
            typeId: node.typeId,
            belongClass: node.belongClass,
            x: 1,
            y: 1,
            shape: "image",
            width: 40,
            height: 40,
            id: node.id,
            imageUrl: node.imageUrl,
          } as ILogicNode);
        });
        (Object.values(currentData?.NODE?.list || {}) as IViewNode[])?.map(
          (item) => {
            dispatch(
              addNode({
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
                z: item.z,
                id: item.id,
                classify: item.classify,
                nodeType: item.nodeType,
                alias: item.alias,
                instance: item.instance,
              })
            );
          }
        );

        setTimeout(() => {
          const newGraph = genWDGraph(currentData?.LOGIC?.G || "{}");
          //查找所有入度为0的点执行
          newGraph
            ?.getVertices()
            .filter((node) => {
              return newGraph?.getInDegree(node).length === 0;
            })
            .map((taskNodeId) => {
              parseMakeByFromId(taskNodeId, {
                toAnd1: () => void 0,
                toAnd0: () => void 0,
                edgeRunOver: () => void 0,
                taskErrorRecord: () => void 0,
                toLoopStop: () => void 0,
                logicItemOver: () => void 0,
                complete: () => void 0,
                startRun: () => void 0,
              });
            });
        }, 0);
      }
    },
    [dispatch, location.pathname]
  );

  useEffect(() => {
    nodeBuilder();
    templateMain();
    console.log(params, "params1");
    draw(indexRef.current.currentData);
    if (params.duration) {
      const sub = loop(params.duration, () => {
        if (indexRef.current.index >= pathList.length - 1) {
          indexRef.current.index = 0;
        } else {
          indexRef.current.index++;
        }
        indexRef.current.currentData =
          localStorageData[pathList[indexRef.current.index]];
        console.log(
          indexRef.current.currentData,
          pathList,
          indexRef.current.index,
          "loop"
        );
        dispatch(clear());
        draw(indexRef.current.currentData);
      });
      return () => {
        sub.unsubscribe();
      };
    }
  }, []);

  if (indexRef.current.currentData) {
    const panel = { ...indexRef.current.currentData?.PANEL, tickUnit: 1 };
    return (
      <div
        style={{
          width: panel.panelWidth + "px",
          height: panel.panelHeight + "px",
          background: panel.panelColor,
          overflow: "hidden",
        }}
      >
        {Object.values(NodesState.list).map((node) => {
          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.x + "px",
                top: node.y + "px",
                width: node.w + "px",
                height: node.h + "px",
                zIndex: node.z,
              }}
            >
              <Temp
                id={node.id}
                isTemp={false}
                PanelState={panel}
                NodesState={NodesState}
              ></Temp>
            </div>
          );
        })}
      </div>
    );
  }
  return <>预览失败</>;
};
