import { useDispatch, useSelector } from 'react-redux';
import { ILs, updateSendDugCount } from '../store/slice/logicSlice.ts';
import { parseMakeByFromId } from './signal3.ts';
import { pushLogicMap } from '../Logic/nodes/emit.ts';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { updateEdge } from '../panel/logicPanelEventSubscribe.ts';
import { createSingleInstance } from './createSingleInstance.ts';
import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';

const findOriginFromGraph = (id: string): string[] => {
  const result: string[] = [];
  const findParent = (childId: string) => {
    if (getWDGraph().getInDegree(childId).length) {
      getWDGraph().getInDegree(childId).map(item => {
        findParent(item);
      });
    } else {
      result.push(childId);
    }
  };
  findParent(id);
  return result;
};

const runningTask = () => {
  const runEdgeVis = new Map<string, { source: string, target: string }[]>;
  return {
    runEdgeVis,
  };
};

export const getRunningTasks = createSingleInstance(runningTask);

const getAllVisOk = () => {
  return [...getRunningTasks().runEdgeVis.values()].reduce((a, b) => a.concat(b), []);
};


export const useSignalMsg = (fromNodeId: string, callCallback?: (calledEdge: {
  source: string,
  target: string
}[]) => void) => {

  const dispatch = useDispatch();
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const go = async () => {
    //任务的id
    const logicId = uuidv4();
    pushLogicMap(fromNodeId, logicId);
    const startTime = dayjs().unix() * 1000;
    parseMakeByFromId(
      fromNodeId,
      {
        complete: () => {
        },
        toAnd0: (edge, origin) => {

        },
        toAnd1: (edge, origin) => {

        },
        toLoopStop: () => {
          setTimeout(() => {
            getRunningTasks().runEdgeVis.set(fromNodeId, []);
            updateEdge(fromNodeId, getAllVisOk());
          }, 500);
        },
        startRun: () => {
          console.log(logicState.sendDugCount, logicId, 'start-p-0');
          dispatch(updateSendDugCount({
            nodeId: fromNodeId,
            id: logicId,
            type: 'pending',
          }));
        },
        taskErrorRecord: () => {
          console.log('start-p-1');
          dispatch(updateSendDugCount({
            nodeId: fromNodeId,
            id: logicId,
            type: 'fail',
            startTime: startTime,
            endTime: dayjs().unix() * 1000,
          }));
          setTimeout(() => {
            getRunningTasks().runEdgeVis.set(fromNodeId, []);
            updateEdge(fromNodeId, getAllVisOk());
          }, 500);
        },
        edgeRunOver: (edge) => {
          console.log(edge, getWDGraph(), 'edge-ss1');

          if (!getRunningTasks().runEdgeVis.has(fromNodeId)) {
            getRunningTasks().runEdgeVis.set(fromNodeId, []);
          }
          getRunningTasks().runEdgeVis.set(fromNodeId,
            (getRunningTasks().runEdgeVis.get(fromNodeId) || []).concat({
              target: edge.target,
              source: edge.source,
            }));
          if (callCallback) {
            callCallback(getRunningTasks().runEdgeVis.get(fromNodeId) || []);
          }
          updateEdge(fromNodeId, getAllVisOk());
        },
        logicItemOver: (id) => {
          console.log('eedd999');
          setTimeout(() => {
            dispatch(updateSendDugCount({
              nodeId: fromNodeId,
              id: logicId,
              type: 'success',
              startTime: startTime,
              endTime: dayjs().unix() * 1000,
            }));
          }, 0);

          setTimeout(() => {
            //逆向查找源节点
            findOriginFromGraph(id).map(originId => {
              getRunningTasks().runEdgeVis.set(originId, []);
              updateEdge(originId, getAllVisOk());
            });
          }, 500);
        },
      },
    );
  };

  return {
    go,
  };
};

