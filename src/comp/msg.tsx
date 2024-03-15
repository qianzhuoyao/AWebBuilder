import { useDispatch, useSelector } from 'react-redux';
import { ILogicNode, ILs, updateSignalSet } from '../store/slice/logicSlice.ts';
import { setDataPool } from '../store/slice/panelSlice.ts';
import { logic_View_bind } from '../store/slice/nodeSlice.ts';
import { parseMakeByFromId } from './signal3.ts';


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
export interface IStage {
  data: any;
  errorTipMsg?: string;
  currentEdge?: {
    from: string
    to: string
    fromPort: string
    toPort: string
  };
  currentNode: {
    node?: ILogicNode
    talkStatus: 'ok' | 'error' | 'pending'
  };
}

interface IOptions {
  isNotAutoReset?: boolean; // default false
  onStageCallback?: (stage: IStage) => void;
}

export const useSignalMsg = (fromNodeId: string, options?: IOptions, callCallback?: (calledEdge: string[]) => void) => {
  const { onStageCallback } = (options || {});
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const dispatch = useDispatch();
  const go = async () => {

    /**
     * 路径输出节点数据缓存，
     * 当节点存在多余两个的出度时，优先选择缓存内的节点数据并输出
     * 存在remote时，则跳过请求，直接使用缓存输出
     */
    const cache:Map<string,any> = new Map()

    const runEdgeVis: Set<string> = new Set();
    parseMakeByFromId(
      fromNodeId,
      logicState,
      onStageCallback,
      (e, node, value) => {
        runEdgeVis.add(e.source);
        runEdgeVis.add(e.target);
        if (callCallback) {
          callCallback([...runEdgeVis]);
        }
        dispatch(updateSignalSet([...runEdgeVis]));

        if (node.typeId === logic_View_bind) {
          console.log(node, value, 'ascascsasacsaaee');
          dispatch(setDataPool({
            bindId: node?.configInfo?.viewMapInfo?.bindViewNodeId || '',
            data: {
              data: value,
              config: node.configInfo?.viewMapInfo,
            },
          }));
        }

      },
      () => {
        setTimeout(() => {
          dispatch(updateSignalSet([]));
        }, 500);
      },
      () => {

      },
    );


  };

  const stop = () => {

  };
  const unStop = () => {

  };

  return {
    unStop,
    go,
    stop,
  };
};

