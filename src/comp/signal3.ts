import { Edge, getWDGraph, IEdgeMessage } from '../DirGraph/weightedDirectedGraph.ts';
import { genLogicNodeMenuItems } from '../Logic/base.ts';
import { concatMap, defer, mergeMap, Observable, of, takeWhile, tap, throwError } from 'rxjs';
import { genLogicConfigMap } from '../Logic/nodes/logicConfigMap.ts';
import { createSingleInstance } from './createSingleInstance.ts';


const dataCache = <T, >() => {
  const cache = new Map<string, T>();
  return {
    cache,
  };
};
const dataAndOperationOrigin = () => {
  const origin = new Map<string, {
    origin0?: string,
    origin1?: string
  }>();
  return {
    origin,
  };
};
const getStreamCache = createSingleInstance(dataCache);
const getAndOrigin = createSingleInstance(dataAndOperationOrigin);
//根据路径解析函数

type IDefaultParams = 'start' | 'end' | 'empty' | 'stop'

interface IEffect<T> {
  edgeRunOver: (edge: Edge<string, IEdgeMessage>, currentId: string, streamValue: T) => void;
  taskErrorRecord: (e: unknown) => void;
  toLoopStop: (edge: Edge<string, IEdgeMessage>, currentId: string, streamValue: T) => void;
  logicItemOver: (id: string) => void;
  toAnd0: (edge: Edge<string, IEdgeMessage>, origin?: {
    origin0?: string;
    origin1?: string;
  }, currentId?: string, streamValue?: T) => void;
  toAnd1: (edge: Edge<string, IEdgeMessage>, origin?: {
    origin0?: string;
    origin1?: string;
  }, currentId?: string, streamValue?: T) => void;
  complete: (id: string) => void;
  startRun: () => void;
}

export interface IMessageFromStream<Pre, Config> {
  config: Config,
  pre: Pre,
  id: string,
  edge: Edge<string, IEdgeMessage> | undefined
}


export const parseMakeByFromId = <P, >(
  origin: string,
  effect: IEffect<P>,
) => {
  //广度遍历节点
  const bfs = <T, >(fromId: string, fromEdge: Edge<string, IEdgeMessage> | undefined, params: T | IDefaultParams): Observable<T | IDefaultParams | unknown> => {
    console.log(fromId, getWDGraph().getOutDegree(fromId), genLogicConfigMap(), 'ghop');
    if (getWDGraph().getOutDegree(fromId).length === 0) {
      //任务结束
      effect.logicItemOver(fromId);
      return of('end');
    }
    //子节点
    const inputPorts = getWDGraph().getEdges(fromId);

    const currentConfig = genLogicConfigMap().configInfo.get(fromId);

    //输出点只允许一个
    if (inputPorts.length) {
      const outPoint = getWDGraph().getEdges(fromId)[0].sourcePort;
      console.log(outPoint, inputPorts, params, 'outPoint');
      //当前节点输出值
      const currentObservable = genLogicNodeMenuItems().initLogicOutMake.get(outPoint.split('#')[1]);
      const currentParams = currentObservable ? currentObservable(
        {
          config: currentConfig,
          pre: params,
          id: fromId,
          edge: fromEdge,
        },
      ) : of(params);
      //子节点的订阅
      const subObservableFn = inputPorts
        .map(target => {
          console.log(target, genLogicNodeMenuItems(), 'genLogicConfigMap().configInfos');
          const fn = genLogicNodeMenuItems().initLogicInMake.get(target.targetPort.split('#')[1]);
          return fn ? {
            id: target.target,
            edge: target,
            observable: fn?.({
              pre: getStreamCache().cache.get(fromId),
              id: target.target,
              config: genLogicConfigMap().configInfo.get(target.source),
              edge: target,
            }),
            // observable: fn(currentParams),
          } : {
            id: target.target,
            edge: target,
            observable: throwError(() => Error('not founded observable')),
          };
        });

      console.log(subObservableFn, currentParams, currentObservable, 'subObservableFn');


      return currentParams?.pipe(
        tap(e => {
          console.log(e, fromId, 'paramys');
          getStreamCache().cache.set(fromId, e);
        }),
        takeWhile(() => getWDGraph().getVertices().includes(
          fromId,
        )),
        concatMap((self) =>
          defer(() => of(...subObservableFn)).pipe(
            mergeMap(({ id, observable, edge }) =>
              defer(() => observable.pipe(
                tap(a => {
                  console.log(a, 'fgffgobservable');
                }),
                takeWhile(() =>
                  getWDGraph().getVertices().includes(edge.target) &&
                  getWDGraph().getVertices().includes(edge.source),
                ),
                mergeMap(() => {
                  console.log(edge, self, params, 'fgffgobservafffble');
                  if (edge.targetPort.indexOf('logic_Ring_get@in-stop') > -1) {
                    effect.toLoopStop(edge, id, self as P);
                  } else if (edge.targetPort.indexOf('logic_and_BOTH_get@in-and-0') > -1) {
                    getAndOrigin().origin.set(id, {
                      origin0: origin,
                      origin1: getAndOrigin().origin.get(id)?.origin1,
                    });
                    effect.toAnd0(edge, getAndOrigin().origin.get(id), id, self as P);
                  } else if (edge.targetPort.indexOf('logic_and_BOTH_get@in-and-1') > -1) {
                    getAndOrigin().origin.set(id, {
                      origin1: origin,
                      origin0: getAndOrigin().origin.get(id)?.origin0,
                    });
                    effect.toAnd1(edge, getAndOrigin().origin.get(id), id, self as P);
                  }
                  effect.edgeRunOver(edge, id, self as P);
                  return defer(() => bfs(id, edge, self));
                }),
              )),
            ),
          ),
        ),
      ) || of('empty');
    }
    return of('end');
  };
  effect.startRun();
  bfs(origin, undefined, 'start').subscribe({
    complete: () => {
      console.log('overss');
      effect.complete(origin);
    },
    error: (e) => {
      effect.taskErrorRecord(e);
    },
  });
};
