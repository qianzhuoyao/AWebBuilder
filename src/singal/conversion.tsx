import { IEdgeMessage, Path, Edge, getWDGraph } from '../DirGraph/weightedDirectedGraph.ts';
import { ILogicEdge, ILogicNode, ILs } from '../store/slice/logicSlice.ts';
import { findActNodeByEdge } from './useSignal.tsx';
import { IBuildInPort, IBuildOutPort, INodeInfo } from '../Logic/base.ts';
import { concat, concatMap, from, map, Observable, of, Subject, tap } from 'rxjs';
import { createSingleInstance } from '../comp/createSingleInstance.ts';
import { toast } from 'react-toastify';
import { IStage } from '../comp/msg.tsx';

/**
 * 将promise转化为任务流
 */
export const taskConversion = (promise: Promise<any>) => {
};
/**
 * 将定时器转化为任务流
 */
export const timerConversion = (timer) => {
};
/**
 * 将请求转化为任务流
 */
export const requestConversion = () => {
};

export interface IParseTaskNode {
  nodeId: string;
  type: 'in' | 'out';
  actLogicEdge: ILogicEdge;
  edge: Edge<string, IEdgeMessage>;
  make: IBuildInPort<any> | IBuildOutPort<any, any>;
}

const getPointerByEdge = (edge: Edge<any, any>, logicSlice: ILs) => {
  //找到实际逻辑边
  const actLogicEdge = logicSlice.logicEdges.find(e => {
    return e.from === edge.source && e.to === edge.target;
  });
  if (actLogicEdge) {
    return findActNodeByEdge(logicSlice, edge);
  }
};
type IPointer = { fromNode: INodeInfo<unknown, unknown> | undefined, toNode: INodeInfo<unknown, unknown> | undefined }
const findMakeByPointer = (pointer?: IPointer) => {
  const actFromPort = pointer?.fromNode?.ports.find(node => {
    return node.type === 'isOut';
  });
  const actToPort = pointer?.toNode?.ports.filter(node => {
    return node.type === 'isIn';
  });
  return {
    actFromPort,
    actToPort,
  };
};

export const parsePortWithArray = (path: Path<string, IEdgeMessage>, logicSlice: ILs) => {
  const res: IParseTaskNode[] = [];
  path.edges.map(edge => {
    //找到实际逻辑边
    const actLogicEdge = logicSlice.logicEdges.find(e => {
      return e.from === edge.source && e.to === edge.target;
    });
    if (actLogicEdge) {
      //两端点
      const { fromNode, toNode } = findActNodeByEdge(logicSlice, edge);
      //找出对应端口
      const actFromPort = fromNode?.ports.find(node => {
        return node.type === 'isOut';
      });
      const actToPort = toNode?.ports.filter(node => {
        return node.type === 'isIn';
      });
      if (actFromPort) {
        const node: IParseTaskNode = {
          type: 'out',
          edge,
          actLogicEdge,
          nodeId: actLogicEdge.from,
          make: actFromPort.make,
        };
        res.push(node);
      }
      if (actToPort) {
        actToPort.map(acp => {
          const node: IParseTaskNode = {
            type: 'in',
            edge,
            actLogicEdge,
            nodeId: actLogicEdge.to,
            make: acp.make,
          };
          res.push(node);
        });
      }
    }
  });
  return res;
};

/**
 * 解析为任务集合
 * @param paths
 * @param logicSlice
 */
export const take = (paths: Path<string, IEdgeMessage>[], logicSlice: ILs) => {

  return paths.map(path => {
    return parsePortWithArray(path, logicSlice);
  });
};

const portSubjectMap = () => {
  const subjectMap = new Map<string, Subject<Edge<any, any>>>();
  const parseTaskNodeMap = new Map<string, ILogicNode>();
  const parseTaskEdgeMap = new Map<string, IParseTaskNode>();
  return {
    subjectMap,
    parseTaskNodeMap,
    parseTaskEdgeMap,
  };
};

export const getPortSubjectMap = createSingleInstance(portSubjectMap);

/**
 * 将任务映射成observable
 * @param tasks
 */
export const tasksMappingObservable = (tasks: IParseTaskNode[]): Observable<IParseTaskNode>[] => {
  return tasks.map(task => {
    return of(task);
  });
};

export const taskMappingObservable = (task: IParseTaskNode): Observable<IParseTaskNode> => {
  return of(task);
};


export const updateSubscribe = (mcTask: IParseTaskNode, logicSlice: ILs) => {
  getPortSubjectMap().subjectMap.set(mcTask.nodeId, new Subject<Edge<any, any>>());
  getPortSubjectMap().parseTaskNodeMap.set(mcTask.actLogicEdge.from + mcTask.actLogicEdge.fromPort, logicSlice.logicNodes[mcTask.actLogicEdge.from]);
  getPortSubjectMap().parseTaskNodeMap.set(mcTask.actLogicEdge.to + mcTask.actLogicEdge.toPort, logicSlice.logicNodes[mcTask.actLogicEdge.to]);
  getPortSubjectMap().parseTaskEdgeMap.set(mcTask.actLogicEdge.to + mcTask.actLogicEdge.toPort, mcTask);
  getPortSubjectMap().parseTaskEdgeMap.set(mcTask.actLogicEdge.from + mcTask.actLogicEdge.fromPort, mcTask);

};

export interface IMakeOption {
  params: any;
  fromId: string;
  logicState: ILs;
}

export interface ICallback {
  //阶段边结束
  onStageOverCallback?: (e: {
    node: { nextPort: IParseTaskNode | undefined, task: Observable<any> },
    value: any
  }) => void;
  //调试记录
  onStageDebuggerCallback?: (stage: IStage) => void;
  //逻辑路径结束
  onLogicRunSuccess?: () => void;
  onLogicRunFail?: () => void;
}

export const startSubscribe = async (id: string, edge: Edge<any, any>, makeOption: IMakeOption, callback: ICallback) => {

  const logicEdgePointer = getPointerByEdge(edge, makeOption.logicState);
  const port = findMakeByPointer(logicEdgePointer);
  const edgeOutPutPort = port.actFromPort;
  const edgeInPort = port.actToPort?.find(p => {
    return p.type === 'isIn' && p.id === edge.targetPort.split('#')[1];
  });

  const outPut = await edgeOutPutPort?.make(makeOption.params, makeOption.logicState.logicNodes[id]);

  const inPut = await edgeInPort?.make(makeOption.params, makeOption.logicState.logicNodes[logicEdgePointer?.toNode?.id || '']);

  

  // getPortSubjectMap().subjectMap.set(id, new Subject<Edge<any, any>>());
  //
  // getPortSubjectMap().subjectMap.get(id)?.pipe(
  //   concatMap(edge => {
  //
  //     console.log(port, edgeInPort, edgeOutPutPort, logicEdgePointer, edge, 'port,logicEdgePointer,');
  //
  //     return of(
  //       {
  //         outPut: from(edgeOutPutPort?.make(makeOption.params, makeOption.logicState.logicNodes[id]) ||
  //           new Promise(r => {
  //             r(undefined);
  //           })),
  //         in: from(edgeInPort?.make(makeOption.params, makeOption.logicState.logicNodes[logicEdgePointer?.toNode?.id || '']) ||
  //           new Promise(r => {
  //             r(undefined);
  //           })),
  //       },
  //     );
  //     // return of({
  //     //   logicEdgePointer,
  //     //   task: from(targetEdgePort?.make(makeOption.params, makeOption.logicNodes[id])
  //     //     || new Promise(resolve => {
  //     //       resolve(undefined);
  //     //     })),
  //     // });
  //
  //   }),
  //   tap(node => {
  //     console.log(node, 'node-tap');
  //     concat(node.in, node.outPut).pipe(
  //       map(a => {
  //         console.log(a, 'sadasdadasdffff');
  //         return a;
  //       }),
  //     ).subscribe();
  //   }),
  //   // tap(node => {
  //   //   node.task.pipe(
  //   //     map(value => {
  //   //       callback.onStageDebuggerCallback?.({
  //   //         data: value,
  //   //         currentEdge: targetEdgePort.actLogicEdge,
  //   //         currentNode: {
  //   //           node: makeOption.logicNodes[targetEdgePort.nodeId],
  //   //           talkStatus: 'ok',
  //   //         },
  //   //       });
  //   //       if (node.nextNode) {
  //   //         console.log(node, getWDGraph().getOutDegree(node.nextNode.id), 'sadasdasd3ee3');
  //   //         //避免环
  //   //         if (node.nextNode.id !== makeOption.fromId && node.nextEdge) {
  //   //           // startSubscribe(node.nextNode.id, node.nextEdge, {
  //   //           //   params: value,
  //   //           //   logicNodes: makeOption.logicNodes,
  //   //           //   fromId: makeOption.fromId,
  //   //           // }, callback);
  //   //         } else {
  //   //           //逻辑结束
  //   //           callback.onLogicRunSuccess?.();
  //   //         }
  //   //       }
  //   //
  //   //       return {
  //   //         node,
  //   //         value,
  //   //       };
  //   //     })).subscribe({
  //   //     next: (e) => {
  //   //       console.log(e, 'eeeeeeeeeeeeeeeeeeeee');
  //   //       callback.onStageOverCallback?.(e);
  //   //     },
  //   //     error: e => {
  //   //       callback.onStageDebuggerCallback?.({
  //   //         data: {},
  //   //         errorTipMsg: e.message,
  //   //         currentNode: {
  //   //           talkStatus: 'error',
  //   //         },
  //   //       });
  //   //       toast.error(e.message);
  //   //       callback.onLogicRunFail?.();
  //   //       console.log(e, 'ererererer');
  //   //     },
  //   //     complete: () => {
  //   //       console.log('succese');
  //   //
  //   //     },
  //   //   });
  //   // }),
  // )?.subscribe({
  //   error: () => {
  //     //逻辑结束
  //     callback.onLogicRunFail?.();
  //   },
  // });
  // getPortSubjectMap().subjectMap.get(id)?.next(edge);
};