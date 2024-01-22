import { Dayjs } from 'dayjs';
import { ReplaySubject } from 'rxjs';

interface ISetProvider {
  type: 'set-dom-provider';
  time: Dayjs;
  value: HTMLElement;
}
type IDomMsg = ISetProvider;

let domObservable$: ReplaySubject<IDomMsg> | null = null;
export const getDomObservable = () => {
  if (!domObservable$) {
    domObservable$ = new ReplaySubject<IDomMsg>();
  }
  return domObservable$;
};

export const removeDomObservable = () => {
  if (domObservable$) {
    domObservable$.unsubscribe();
  }
  domObservable$ = null;
};
