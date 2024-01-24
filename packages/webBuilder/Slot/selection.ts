import { Dayjs } from 'dayjs';
import Moveable, { OnClick, OnEvent, WithEventStop } from 'moveable';
import { Subject } from 'rxjs';
import { TemplateNode } from 'templateSlot';

export interface ISelectionMove {
  type: 'selection-move';
  value: {
    left: number;
    top: number;
  };
  time: Dayjs;
}
export interface ISelectionOver {
  type: 'selection-over';
  value: TemplateNode;
  time: Dayjs;
}

export interface IClick {
  time: Dayjs;
  value: OnEvent;
  type: 'click';
}
export interface ISelection {
  type: 'select';
  value: TemplateNode;
  time: Dayjs;
}

type IParamsType = ISelection | ISelectionMove | IClick | ISelectionOver;

let selection$: Subject<IParamsType> | null = null;

export const getSelectionObservable = () => {
  if (!selection$) {
    selection$ = new Subject<IParamsType>();
  }
  return selection$;
};
export const removeSelectionObservable = () => {
  if (selection$) {
    selection$.unsubscribe();
  }
  selection$ = null;
};
