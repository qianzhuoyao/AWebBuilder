import { useDispatch, useSelector } from 'react-redux';
import { ILs, updateSendDugCount } from '../store/slice/logicSlice.ts';
import { parseMakeByFromId } from './signal3.ts';
import { pushLogicMap } from '../Logic/nodes/emit.ts';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { updateEdge } from '../panel/logicPanelEventSubscribe.ts';
import { createSingleInstance } from './createSingleInstance.ts';
import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';


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
          //获取其另外入口
          console.log(origin,'0origin');
          const other1 = origin?.origin1;
          if (other1) {
            getRunningTasks().runEdgeVis.set(other1, []);
            updateEdge(other1, getAllVisOk());
          }
        },
        toAnd1: (edge, origin) => {
          console.log(origin,'1origin');
          const other0 = origin?.origin0;
          if (other0) {
            getRunningTasks().runEdgeVis.set(other0, []);
            updateEdge(other0, getAllVisOk());
          }
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
          console.log(edge, 'edge-s');

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
        logicItemOver: () => {
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
            getRunningTasks().runEdgeVis.set(fromNodeId, []);
            updateEdge(fromNodeId, getAllVisOk());
          }, 500);
        },
      },
    );
  };

  return {
    go,
  };
};

