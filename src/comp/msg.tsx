import { useDispatch } from 'react-redux';
import { updateSignalSet } from '../store/slice/logicSlice.ts';
import { parseMakeByFromId } from './signal3.ts';


export const useSignalMsg = (fromNodeId: string, callCallback?: (calledEdge: string[]) => void) => {

  const dispatch = useDispatch();


  const go = async () => {

    const runEdgeVis: Set<string> = new Set();
    parseMakeByFromId(
      fromNodeId,
      {
        taskErrorRecord: () => {

        },
        edgeRunOver: (edge) => {
          runEdgeVis.add(edge.source);
          runEdgeVis.add(edge.target);
          if (callCallback) {
            callCallback([...runEdgeVis]);
          }
          dispatch(updateSignalSet([...runEdgeVis]));
        },
        logicItemOver: () => {
          setTimeout(() => {
            dispatch(updateSignalSet([]));
          }, 500);
        },
      },
    );
  };

  return {
    go,
  };
};

