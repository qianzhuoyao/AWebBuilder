import { mergeMap, defer, from, concatMap } from 'rxjs';

/**
 * 并发任务的管道
 *
 * @param   {number}  taskLimit  [taskLimit description]
 *
 * @return  {[type]}             [return description]
 */
export const mergeTaskPipe = <T>(taskLimit: number) =>
  mergeMap((task: () => Promise<T>) => defer(() => from(task())), taskLimit);

export const concatTaskPipe = <T>() =>
  concatMap((task: () => Promise<T>) => from(task()));
