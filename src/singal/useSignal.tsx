import { IStage } from '../comp/msg.tsx';
import { getWDGraph, IEdgeMessage, Edge } from '../DirGraph/weightedDirectedGraph.ts';
import { useDispatch, useSelector } from 'react-redux';
import { ILs, updateSignalSet } from '../store/slice/logicSlice.ts';
import { mapNodeBindPort } from '../comp/mapNodePort.ts';
import {
  getPortSubjectMap,
  IParseTaskNode,
  startSubscribe,
  take,
  taskMappingObservable,
  updateSubscribe,
} from './conversion.tsx';
import { concatMap, from, map, mergeMap, Observable, of, Subject } from 'rxjs';
import { toast } from 'react-toastify';
import { logic_View_bind } from '../store/slice/nodeSlice.ts';
import { setDataPool } from '../store/slice/panelSlice.ts';
import { useEffect } from 'react';

/**
 * 实际的发送信号同useSignalMsg
 */
interface IOptions {
  //每次边执行完的回调
  onStageCallback?: (stage: IStage) => void;
  //路径执行完的回调
  onTasksOverCallCallback?: () => void;
}

export const getPath = (fromNodeId: string) => {
  return getWDGraph().findAllPaths(fromNodeId);
};

//对流任务的结果捕获
export const catchTaskResult = () => {
};

//根据边查询端点
export const findActNodeByEdge = (logicSlice: ILs, edge: Edge<string, IEdgeMessage>) => {
  return {
    fromNode: mapNodeBindPort({
      belongClass: logicSlice.logicNodes[edge.source]?.belongClass,
      typeId: logicSlice.logicNodes[edge.source]?.typeId,
    }),
    toNode: mapNodeBindPort({
      belongClass: logicSlice.logicNodes[edge.target]?.belongClass,
      typeId: logicSlice.logicNodes[edge.target]?.typeId,
    }),
  };
};


export const useSignal = (fromNodeId: string, options?: IOptions) => {
  const { onStageCallback, onTasksOverCallCallback } = (options || {});
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const dispatch = useDispatch();


  /**
   * this is dirty code **shit**
   */
  const go = async () => {
    const signalSet: Set<string> = new Set();
    //当前路径集合
    const paths = getWDGraph().findAllPaths(fromNodeId);
    console.log(paths, 'efeonStageDebuggerCallback');
    paths.map(path => {
      startSubscribe(fromNodeId, path.edges[0], {
        params: undefined,
        logicState: logicState,
        fromId: fromNodeId,
      }, {
        onStageDebuggerCallback: (e) => {
          onStageCallback?.(e);
          console.log(e, 'efeonStageDebuggerCallback');
          if (e.currentNode.talkStatus === 'ok') {
            //调试成功才变色
            signalSet.add(e.currentEdge?.from || '');
            signalSet.add(e.currentEdge?.to || '');
            //dispatch(updateSignalSet([e.currentEdge?.from, e.currentEdge?.to]));
          }
        },
        onStageOverCallback: (e) => {
          if (e.node.currentNode) {
            if (logicState.logicNodes[e.node.currentNode.edge.target].typeId === logic_View_bind) {
              dispatch(setDataPool({
                bindId: logicState.logicNodes[e.node.currentNode.edge.target]?.configInfo?.viewMapInfo?.bindViewNodeId || '',
                data: {
                  data: e.value,
                  config: logicState.logicNodes[e.node.currentNode.edge.target].configInfo?.viewMapInfo,
                },
              }));
            }
          }

        },
        onLogicRunSuccess: () => {
          console.log('efeonStageDebuggerCallback=1');
          onTasksOverCallCallback?.();
          dispatch(updateSignalSet([...signalSet]));
          setTimeout(() => {
            dispatch(updateSignalSet([]));
          }, 1000);
        },
      });
    });


  };
  return {
    go,
  };
};



