import { ReplaySubject } from 'rxjs';
import { ISize } from '../Layout/panel';
import { Dayjs } from 'dayjs';

/**
 * layer的通讯
 */
export const ASYNC_SIZE = 'ASYNC_SIZE' as const;

interface IAsyncTrigger {
  type: typeof ASYNC_SIZE;
  time: Dayjs;
  value: ISize;
}

export type ILayerMsg = IAsyncTrigger;
/**
 * 讯息
 *
 * @var {[type]}
 */
let layerObservable$: ReplaySubject<ILayerMsg> | null = null;

/**
 * 创建layer 的订阅
 *
 * @return  {<ReplaySubject><ILayerMsg>}[return description]
 */
export const getLayerObservable = (): ReplaySubject<ILayerMsg> => {
  if (!layerObservable$) {
    layerObservable$ = new ReplaySubject<ILayerMsg>();
  }
  return layerObservable$;
};

/**
 * 移除订阅
 *
 * @return  {[type]}  [return description]
 */
export const removeLayerObservable = () => {
  if (layerObservable$) {
    layerObservable$.unsubscribe();
  }
  layerObservable$ = null;
};
