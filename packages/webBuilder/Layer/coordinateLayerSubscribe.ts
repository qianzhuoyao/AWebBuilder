/**
 * fCanvas 的 事件 订阅
 */

import { Dayjs } from 'dayjs';
import { ReplaySubject } from 'rxjs';

export interface IFcanvasRes {
  time: Dayjs;
  type:
    | 'fCanvas-mouse-up'
    | 'fCanvas-mouse-down'
    | 'fCanvas-mouse-wheel'
    | 'grid-size-set'
    | 'fCanvas-mouse-move'
    | 'grid-zoom-set'
    | 'grid-transform-set'
    | 'grid-scale-set'
    | 'fCanvas-mouse-selection';
  options: any;
}

type IFcanvasEvent = () => Promise<IFcanvasRes>;
/**
 * 讯息
 *
 * @var {[type]}
 */
let coordinateObservable$: ReplaySubject<IFcanvasEvent> | null = null;

export const getCoordinateObservable = (): ReplaySubject<IFcanvasEvent> => {
  if (!coordinateObservable$) {
    coordinateObservable$ = new ReplaySubject<IFcanvasEvent>();
  }
  return coordinateObservable$;
};

export const removeCoordinateObservable = () => {
  if (coordinateObservable$) {
    coordinateObservable$.unsubscribe();
  }
  coordinateObservable$ = null;
};
