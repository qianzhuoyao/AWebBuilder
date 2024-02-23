import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { useDispatch, useSelector } from 'react-redux';
import { ILs, updateSignalSet } from '../store/slice/logicSlice.ts';
import { mapNodeBindPort } from './mapNodePort.ts';


/**
 * 信号
 * 通知 fromID -> toID
 * a->b->c
 * useSignalMsg(a)
 *
 * task:a->b(promise)
 *
 * task:b->c(promise)
 *
 */

interface IOptions {
  isNotAutoReset?: boolean; // default false
}

export const useSignalMsg = (fromNodeId: string, options?: IOptions, callCallback?: (calledEdge: string[]) => void) => {
  const { isNotAutoReset } = (options || {});
  let stopStatus = false;
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const dispatch = useDispatch();
  const go = async () => {

    const runEdgeVis: Set<string> = new Set();


    const Paths = getWDGraph().findAllPaths(fromNodeId);
    //确定任务时序
    for await(const path of Paths) {
      let initParams: any = [];
      let deParams: any = {};
      for await (const edge of path.edges) {
        const portLogicEdge = logicState.logicEdges.find(e => {
          return e.from === edge.source && e.to === edge.target;
        });
        if (portLogicEdge) {
          const { toPort, from, to } = portLogicEdge;
          const fromTem = mapNodeBindPort({
            belongClass: logicState.logicNodes[edge.source]?.belongClass,
            typeId: logicState.logicNodes[edge.source]?.typeId,
          });
          const toTem = mapNodeBindPort({
            belongClass: logicState.logicNodes[edge.target]?.belongClass,
            typeId: logicState.logicNodes[edge.target]?.typeId,
          });

          // const sourceNodeInRes = edge

          const currentFromMakeTask = fromTem.ports.find(port => {
            return port.type === 'isOut';
          });
          const currentToMakeTasks = toTem.ports.filter(port => {
            console.log(toPort.split('#')[1], port.portName, 'currentToMakeTask');
            // return port.portName === toPort.split('#')[1];
            return port.type === 'isIn';
          });
          if (!stopStatus) {
            for (const inTask of currentToMakeTasks) {
              //获取in节点入度
              if (!getWDGraph().getInDegree(from).length) {
                const res = await inTask.make({});

                console.log(logicState, 'logicStatessssssfc');
                initParams.push(res);
              } else {
                const res = await inTask.make(deParams);
                initParams.push(res);
              }
            }
            runEdgeVis.add(to);
            deParams = await currentFromMakeTask.make(initParams);
            runEdgeVis.add(from);
            if (callCallback) {
              callCallback([...runEdgeVis]);

            }
            dispatch(updateSignalSet([...runEdgeVis]));
            console.log(fromTem, toTem, path, to, currentFromMakeTask, currentToMakeTasks, portLogicEdge, 'dddddddddd');


          }

        }
      }
    }
    if (!isNotAutoReset) {
      const time = setTimeout(() => {
        dispatch(updateSignalSet([]));
        clearTimeout(time);
      }, 100);
    }

    console.log(Paths, 'pathNodeIds');

  };

  const stop = () => {
    stopStatus = true;
  };
  const unStop = () => {
    stopStatus = false;
  };

  return {
    unStop,
    go,
    stop,
  };
};