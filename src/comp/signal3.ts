import { Edge, getWDGraph, IEdgeMessage } from '../DirGraph/weightedDirectedGraph.ts';
import { genLogicNodeMenuItems } from '../Logic/base.ts';
import { concatMap, mergeMap, Observable, of, takeWhile, tap, throwError } from 'rxjs';


//根据路径解析函数

type IDefaultParams = 'start' | 'end' | 'empty'


interface IEffect<T> {
  edgeRunOver: (edge: Edge<string, IEdgeMessage>, currentId: string, streamValue: T) => void;
  taskErrorRecord: (e: unknown) => void;
  logicItemOver: (id: string) => void;
}


const parseFn = <T, >(
  fn: (params: Observable<unknown>) => Observable<T>,
  params: Observable<unknown>,
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
  const bfs = <T, >(fromId: string, params: T | IDefaultParams): Observable<T | IDefaultParams | unknown> => {
    console.log(fromId, getWDGraph().getOutDegree(fromId), 'ghop');
    if (getWDGraph().getOutDegree(fromId).length === 0) {
      effect.logicItemOver(fromId);
      return of('end');
    }
    //子节点
    const inputPorts = getWDGraph().getEdges(fromId);

    //输出点只允许一个
    if (inputPorts.length) {
      const outPoint = getWDGraph().getEdges(fromId)[0].sourcePort;
      console.log(outPoint, 'outPoint');
      //当前节点输出值
      const currentObservable = genLogicNodeMenuItems().initLogicOutMake.get(outPoint.split('#')[1]);
      const currentParams = currentObservable ? currentObservable(params) : of(params);
      //子节点的订阅
      const subObservableFn = inputPorts
        .map(target => {
          const fn = genLogicNodeMenuItems().initLogicInMake.get(target.targetPort.split('#')[1]);
          return fn ? {
            id: target.target,
            edge: target,
            observable: parseFn(fn, currentParams),
            // observable: fn(currentParams),
          } : {
            id: target.target,
            edge: target,
            observable: throwError(() => Error('not founded observable')),
          };
        });

      console.log(subObservableFn, currentParams, currentObservable, 'subObservableFn');
      return currentParams?.pipe(
        takeWhile(() => getWDGraph().getVertices().includes(
          fromId,
        )),
        tap(e => {
          console.log(e, 'params');
        }),
        concatMap(() =>
          of(...subObservableFn).pipe(
            mergeMap(({ id, observable, edge }) =>
              observable.pipe(
                mergeMap((z) => {
                  effect.edgeRunOver(edge, id, z as P);
                  console.log(z, id, 'z0p0');
                  return bfs(id, z);
                }),
              ),
            ),
          )),
      ) || of('empty');
    }
    return of('end');
  };
  bfs(origin, 'start').subscribe({
    error: (e) => {
      effect.taskErrorRecord(e);
    },
  });
};
