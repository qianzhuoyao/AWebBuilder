import { Dayjs } from 'dayjs';
import Moveable from 'moveable';
import { Subject } from 'rxjs';
import { TemplateNode } from 'templateSlot';

interface IDelete {
  time: Dayjs;
  type: 'DELETE';
  value: {
    id: string;
    moveable?: Moveable;
  };
}
interface IMoveStart {
  time: Dayjs;
  type: 'MOVE_START';
  value: {
    id: string;
    moveable?: Moveable;
    info: {
      left: number;
      top: number;
    };
  };
}
interface IMoveOver {
  time: Dayjs;
  type: 'MOVE_OVER';
  value: {
    id: string;
    moveable?: Moveable;
    info: {
      left: number;
      top: number;
    };
  };
}
interface IMove {
  time: Dayjs;
  type: 'MOVE';
  value: {
    id: string;
    moveable?: Moveable;
    info: {
      left: number;
      top: number;
    };
  };
}

type IBathMsg = IDelete | IMove|IMoveOver|IMoveStart;

let selectionNodesObservable$: Subject<IBathMsg> | null = null;

export const getSelectionNodesObservable = (): Subject<IBathMsg> => {
  if (!selectionNodesObservable$) {
    selectionNodesObservable$ = new Subject<IBathMsg>();
  }
  return selectionNodesObservable$;
};

export const removeSelectionNodesObservable = () => {
  if (selectionNodesObservable$) {
    selectionNodesObservable$.unsubscribe();
  }
  selectionNodesObservable$ = null;
};
