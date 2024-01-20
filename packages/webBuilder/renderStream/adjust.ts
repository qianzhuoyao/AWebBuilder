/**
 * 并行的执行调整slot的作用
 * 包含 alignGrid
 * 此处注册adjust 调整任务流
 */

import { Subject } from 'rxjs';

import type { ISlot } from '../Slot/slot';

type adjustTask = () => Promise<ISlot>;

let adjust$: Subject<adjustTask> | null = null;

/**
 * 修正流 订阅
 * 将slot 按照 坐标 进行校准
 *
 * @return  {<Subject><adjustTask>}[return description]
 */
export const getAdjust = (): Subject<adjustTask> => {
  if (!adjust$) {
    adjust$ = new Subject<adjustTask>();
  }
  return adjust$;
};

/**
 * 移除修正流
 *
 * @return  {[type]}  [return description]
 */
export const removeAdjust = () => {
  if (adjust$) {
    adjust$.unsubscribe();
  }
  adjust$ = null;
};
