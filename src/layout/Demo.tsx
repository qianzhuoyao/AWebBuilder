//预览
import { Temp } from '../panel/operation.tsx';
import { useEffect } from 'react';
import { nodeBuilder } from '../Logic/nodes';
import { CONSTANT_DEMO_PATH } from '../contant';
import { genWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { parseMakeByFromId } from '../comp/signal3.ts';
import { createNode } from '../panel/logicPanelEventSubscribe.ts';
import { ILogicNode } from '../store/slice/logicSlice.ts';
import { addNode, INs } from '../store/slice/nodeSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { genLogicConfigMapToParse } from '../Logic/nodes/logicConfigMap.ts';


export const Demo = () => {
  const dispatch = useDispatch();
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const previewLogic = window.localStorage.getItem('DEMO-LOGIC#');
  const previewData = window.localStorage.getItem('DEMO-NODE#');
  const previewPanelData = window.localStorage.getItem('DEMO-PANEL#');
  const parseConfig = JSON.parse(previewLogic || '{}');
  const data = JSON.parse(previewData);

  useEffect(() => {
    if (window.location.pathname.slice(0, 6) === CONSTANT_DEMO_PATH) {
      nodeBuilder();
      genLogicConfigMapToParse(parseConfig.C);
      Object.values(data.list || {})?.map(item => {
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
          }),
        );
      });

      Object.values(JSON.parse(parseConfig.N || '{}'))?.map(node => {
        createNode({
          typeId: node.typeId,
          belongClass: node.belongClass,
          x: 1,
          y: 1,
          shape: 'image',
          width: 40,
          height: 40,
          id: node.id,
          imageUrl: node.imageUrl,
        } as ILogicNode);
      });
      const newGraph = genWDGraph(parseConfig.G || '');
      console.log(newGraph?.getVertices().filter(node => {
        return newGraph?.getInDegree(node).length === 0;
      }), 'newGraph');
      //查找所有入度为0的点执行
      newGraph?.getVertices().filter(node => {
        return newGraph?.getInDegree(node).length === 0;
      }).map(taskNodeId => {
        parseMakeByFromId(taskNodeId, {
          edgeRunOver: () => void 0,
          taskErrorRecord: () => void 0,
          toLoopStop: () => void 0,
          logicItemOver: () => void 0,
          complete: () => void 0,
          startRun: () => void 0,
        });
      });
    }

    setTimeout(() => {
      console.log(NodesState, 'adasdas3efNodesState3f3');
    }, 0);
  }, [previewLogic]);

  if (previewData && previewPanelData) {
    const panel = JSON.parse(previewPanelData);
    return <div style={{
      width: panel.panelWidth + 'px',
      height: panel.panelHeight + 'px',
      background: panel.panelColor,
      overflow: 'hidden',
    }}>{
      Object.values(NodesState.list).map(node => {
        return <div
          key={node.id}
          style={{
            position: 'absolute',
            left: node.x + 'px',
            top: node.y + 'px',
            width: node.w + 'px',
            height: node.h + 'px',
            zIndex: node.z,
          }}>
          <Temp id={node.id}
                isTemp={false}
                PanelState={panel}
                NodesState={NodesState}></Temp>
        </div>;
      })
    }</div>;
  }
  return <>预览失败</>;
};