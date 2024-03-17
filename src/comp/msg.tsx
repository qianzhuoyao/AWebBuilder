import { useDispatch, useSelector } from 'react-redux';
import { clearSignalSet, ILs, updateSendDugCount, updateSignalSet } from '../store/slice/logicSlice.ts';
import { parseMakeByFromId } from './signal3.ts';
import { pushLogicMap } from '../Logic/nodes/emit.ts';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

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
    let runEdgeVis: { source: string, target: string }[] = [];
    parseMakeByFromId(
      fromNodeId,
      {
        complete: () => {
        },
        toLoopStop: () => {
          dispatch(clearSignalSet());
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
        },
        edgeRunOver: (edge) => {
          console.log(edge, 'edge-s');

          runEdgeVis.push({
            target: edge.target,
            source: edge.source,
          });
          if (callCallback) {
            callCallback(runEdgeVis);
          }
          dispatch(updateSignalSet([...runEdgeVis]));
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
            runEdgeVis = [];
            dispatch(clearSignalSet());
          }, 500);
        },
      },
    );
  };

  return {
    go,
  };
};

