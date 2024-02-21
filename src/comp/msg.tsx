import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { useSelector } from 'react-redux';
import { ILs } from '../store/slice/logicSlice.ts';
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


export const useSignalMsg = (fromNodeId: string) => {
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });

  const Paths = getWDGraph().findAllPaths(fromNodeId);
  //确定任务时序
  Paths.map(path => {
    path.edges.map(edge => {

      const portLogicEdge = logicState.logicEdges.find(e => {
        return e.from === edge.source && e.to === edge.target;
      });
      if (portLogicEdge) {
        const { fromPort, toPort } = portLogicEdge;

        const fromTem = mapNodeBindPort({
          belongClass: logicState.logicNodes[edge.source]?.belongClass,
          typeId: logicState.logicNodes[edge.source]?.typeId,
        });
        const toTem = mapNodeBindPort({
          belongClass: logicState.logicNodes[edge.target]?.belongClass,
          typeId: logicState.logicNodes[edge.target]?.typeId,
        });

        // const {} = fromTem[]

        console.log(fromTem, toTem, 'dddddddddd');
      }

    });
  });

  console.log(Paths, 'pathNodeIds');
};