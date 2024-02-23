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
      let initParams: any = {};
      let deParams: any = {};
      for await (const edge of path.edges) {
        const portLogicEdge = logicState.logicEdges.find(e => {
          return e.from === edge.source && e.to === edge.target;
        });
        if (portLogicEdge) {
          const { from, to } = portLogicEdge;

          //如果目标无出度，则不对其边进行计算
          //
          // if (getWDGraph().getOutDegree(to).length === 0) {
          //   return;
          // }

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
            return port.type === 'isIn';
          });
          if (!stopStatus) {

            if (getWDGraph().getInDegree(from).length === 0) {
              deParams = await currentFromMakeTask.make(initParams, logicState.logicNodes[edge.source]);
            }else{
              deParams = await currentFromMakeTask.make(initParams, logicState.logicNodes[edge.target]);
            }
            console.log(deParams, edge, currentToMakeTasks, toTem, 'deParams');
            for await (const inTask of currentToMakeTasks) {
              console.log(logicState.logicNodes[edge.source], getWDGraph().getInDegree(from).length, currentFromMakeTask, 'getWDGraph().getInDegree(from).length');
              //获取in节点入度
              const res = await inTask.make({
                fromNodes: {
                  id: from,
                  type: logicState.logicNodes[edge.source]?.typeId,
                  data: deParams,
                },
              }, logicState.logicNodes[edge.target]);
              initParams=res;
            }
            runEdgeVis.add(to);
            // deParams = await currentFromMakeTask.make(initParams, logicState.logicNodes[edge.target]);
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