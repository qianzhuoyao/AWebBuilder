import { getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { useDispatch, useSelector } from 'react-redux';
import { ILogicNode, ILs, updateSignalSet } from '../store/slice/logicSlice.ts';
import { mapNodeBindPort } from './mapNodePort.ts';
import { toast } from 'react-toastify';
import { IPs, setDataPool } from '../store/slice/panelSlice.ts';
import { logic_View_bind } from '../store/slice/nodeSlice.ts';


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
  const { isNotAutoReset, onStageCallback } = (options || {});
  let stopStatus = false;
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  const PanelState = useSelector((state: { panelSlice: IPs }) => {
    return state.panelSlice;
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
          const { from, to, fromPort, toPort } = portLogicEdge;

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
              try {
                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.source],
                      talkStatus: 'pending',
                    },
                  },
                );
                if(cache.has(from+fromPort)){
                  deParams = cache.get(from+fromPort)
                }else{
                  deParams = await currentFromMakeTask.make(initParams, logicState.logicNodes[edge.source]);
                  cache.set(from+fromPort,deParams)
                }

                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.source],
                      talkStatus: 'ok',
                    },
                  },
                );
              } catch (e) {
                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    errorTipMsg: e.message,
                    currentNode: {
                      node: logicState.logicNodes[edge.source],
                      talkStatus: 'error',
                    },
                  },
                );
                toast.error(e.message);
                console.error(e);
                break;
              }

            } else {
              try {
                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'pending',
                    },
                  },
                );
                if(cache.has(from+fromPort)){
                  deParams = cache.get(from+fromPort)
                }else {
                  deParams = await currentFromMakeTask.make(initParams, logicState.logicNodes[edge.target]);
                  cache.set(from+fromPort,deParams)
                }
                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'ok',
                    },
                  },
                );
              } catch (e) {
                onStageCallback && onStageCallback(
                  {
                    data: initParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    errorTipMsg: e.message,
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'error',
                    },
                  },
                );
                toast.error(e.message);
                console.error(e);
                break;
              }
            }
            console.log(deParams, edge, currentToMakeTasks, toTem, 'deParams');
            for await (const inTask of currentToMakeTasks) {
              console.log(logicState.logicNodes[edge.source], getWDGraph().getInDegree(from).length, currentFromMakeTask, 'getWDGraph().getInDegree(from).length');
              //获取in节点入度
              try {
                onStageCallback && onStageCallback(
                  {
                    data: deParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'pending',
                    },
                  },
                );
                if(cache.has(to+toPort)){
                  initParams = cache.get(to+toPort)
                }else{
                  const res = await inTask.make({
                    fromNodes: {
                      id: from,
                      logicNode: logicState.logicNodes[edge.target],
                      type: logicState.logicNodes[edge.source]?.typeId,
                      data: deParams,
                    },
                  }, logicState.logicNodes[edge.target]);
                  initParams = res;
                  cache.set(to+toPort,res)
                }

                onStageCallback && onStageCallback(
                  {
                    data: deParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'ok',
                    },
                  },
                );
                //同步数据池
                if (logicState.logicNodes[edge.target].typeId === logic_View_bind) {
                  dispatch(setDataPool({
                    bindId: logicState.logicNodes[edge.target]?.configInfo?.viewMapInfo?.bindViewNodeId || '',
                    data: {
                      data: deParams,
                      config: logicState.logicNodes[edge.target].configInfo?.viewMapInfo,
                    },
                  }));
                }
              } catch (e) {
                onStageCallback && onStageCallback(
                  {
                    data: deParams,
                    currentEdge: {
                      from,
                      fromPort,
                      to,
                      toPort,
                    },
                    errorTipMsg: e.message,
                    currentNode: {
                      node: logicState.logicNodes[edge.target],
                      talkStatus: 'error',
                    },
                  },
                );
                toast.error(e.message);
                console.error(e);
                break;
              }

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
    //执行完毕清空缓存
    cache.clear()
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

