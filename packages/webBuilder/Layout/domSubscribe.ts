import { Dayjs } from 'dayjs';
import {  Subject } from 'rxjs';

interface ISetProvider {
  type: 'set-dom-provider';
  time: Dayjs;
  value: HTMLElement;
}
type IDomMsg = ISetProvider;

let domObservable$: Subject<IDomMsg> | null = null;
export const getDomObservable = () => {
  if (!domObservable$) {
    domObservable$ = new Subject<IDomMsg>();
  }
  return domObservable$;
};

export const removeDomObservable = () => {
  if (domObservable$) {
    domObservable$.unsubscribe();
  }
  domObservable$ = null;
};
