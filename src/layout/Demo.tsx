//预览
import { Temp } from "../panel/operation.tsx";
import { useCallback, useEffect, useRef } from "react";
import { nodeBuilder } from "../Logic/nodes";
import { CONSTANT_DEMO_PATH, DEMO_LOCALSTORAGE } from "../contant";
import { genWDGraph } from "../DirGraph/weightedDirectedGraph.ts";
import { parseMakeByFromId } from "../comp/signal3.ts";
import { createNode } from "../panel/logicPanelEventSubscribe.ts";
import { ILogicNode } from "../store/slice/logicSlice.ts";
import { addNode, INs, IViewNode } from "../store/slice/nodeSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { genLogicConfigMapToParse } from "../Logic/nodes/logicConfigMap.ts";
import { templateMain } from "../node/index.ts";
import { useLocation, useSearchParams } from "react-router-dom";
import { loop } from "../comp/loop.ts";

export const Demo = () => {
  const indexRef = useRef<{
    index: number;
    currentData: any;
  }>({
    index: 0,
    currentData: {},
  });
  const [search] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const localStorageDataJSON = window.localStorage.getItem(DEMO_LOCALSTORAGE);
  const localStorageData = JSON.parse(localStorageDataJSON || "{}");
  console.log(localStorageData[search.get("work") || ""], "dasdasd");
  const params = JSON.parse(search.get("work") || "{}");
  console.log(params, "asdasffff");
  const pathList = params?.indexList || [];
  console.log(params, search.get("work"), "sfasgtagsasg");
  const draw = useCallback(
    (currentData: any) => {
      if (location.pathname + "/" === CONSTANT_DEMO_PATH && currentData) {
        nodeBuilder();
        templateMain();
        genLogicConfigMapToParse(currentData?.LOGIC?.C || "{}");
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
      }
    },
    [dispatch, location.pathname]
  );
  indexRef.current.currentData =
    localStorageData[pathList[indexRef.current.index]];
  useEffect(() => {
    if (params.duration) {
      const sub = loop(params.duration, () => {
        if (indexRef.current.index >= pathList.length - 1) {
          indexRef.current.index++;
        }
        console.log(indexRef.current.currentData,"loop");
        draw(indexRef.current.currentData);
      });
      return () => {
        sub.unsubscribe();
      };
    } else {
      draw(indexRef.current.currentData);
    }
  }, []);

  if (indexRef.current.currentData) {
    const panel = indexRef.current.currentData?.PANEL;
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
