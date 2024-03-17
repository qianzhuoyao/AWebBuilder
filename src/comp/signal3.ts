import { Edge, getWDGraph, IEdgeMessage } from '../DirGraph/weightedDirectedGraph.ts';
import { genLogicNodeMenuItems } from '../Logic/base.ts';
import { concatMap, mergeMap, Observable, of, takeWhile, tap, throwError } from 'rxjs';
import { genLogicConfigMap } from '../Logic/nodes/logicConfigMap.ts';


//根据路径解析函数

type IDefaultParams = 'start' | 'end' | 'empty' | 'stop'

interface IEffect<T> {
  edgeRunOver: (edge: Edge<string, IEdgeMessage>, currentId: string, streamValue: T) => void;
  taskErrorRecord: (e: unknown) => void;
  logicItemOver: (id: string) => void;
  startRun: () => void;
}


const parseFn = <T, >(
  fn: (params: T | IDefaultParams) => Observable<T>,
  params: T | IDefaultParams,
) => {
  try {
    return fn(params);
  } catch (e) {
    return throwError(() => Error('parseFn error'));
  }
};

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
      console.log(outPoint, 'outPoint');
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
          //  const targetConfig = genLogicConfigMap().configInfo.get(fromId);

          const fn = genLogicNodeMenuItems().initLogicInMake.get(target.targetPort.split('#')[1]);
          return fn ? {
            id: target.target,
            edge: target,
            observable: parseFn(fn, {
              pre: params,

              id: target.target,
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
          console.log(e, 'params');
        }),
        takeWhile(() => getWDGraph().getVertices().includes(
          fromId,
        )),
        concatMap(() =>
          of(...subObservableFn).pipe(
            mergeMap(({ id, observable, edge }) =>
              observable.pipe(
                mergeMap((z) => {
                  effect.edgeRunOver(edge, id, z as P);
                  if (edge.targetPort.indexOf('in-stop') > -1) {
                    effect.logicItemOver(fromId);
                    return of('stop');
                  }
                  return bfs(id, edge, z);
                }),
              ),
            ),
          )),
      ) || of('empty');
    }
    return of('end');
  };
  bfs(origin, undefined, 'start').pipe(
    tap(() => {
      effect.startRun();
    }),
  ).subscribe({
    error: (e) => {
      effect.taskErrorRecord(e);
    },
  });
};
