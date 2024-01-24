import { Subject } from 'rxjs';

//结束通知
interface IOver {
  type: 'OVER';
}
//通知
interface ISignal {
  type: 'SIGNAL';
  bothId: string[];
  syncPosition: { id: string; left: number; top: number }[];
}
//开始移动以及偏移量
interface IBothMoveOffset {
  type: 'MOVE';
  id: string;
  left: number;
  top: number;
}

let bothMove$: Subject<IBothMoveOffset | ISignal | IOver> | null = null;

export const getBothMoveObservable = () => {
  if (!bothMove$) {
    bothMove$ = new Subject<IBothMoveOffset | ISignal | IOver>();
  }
  return bothMove$;
};
export const removeBothMoveObservable = () => {
  if (bothMove$) {
    bothMove$.unsubscribe();
  }
  bothMove$ = null;
};
