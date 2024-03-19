import { createSingleInstance } from '../comp/createSingleInstance.ts';
import { ReplaySubject } from 'rxjs';

type viewId = string
const windowData = <T, >() => {
  const data = new Map<viewId, T>();
  const viewInsertObservable = new ReplaySubject<T>();
  return {
    data,
    viewInsertObservable,
  };
};

const getWindowDataInstance = createSingleInstance(windowData);


export const subscribeViewCacheUpdate = <T, >(subscribe: (value: {
  viewId?: string, data?: T
} | unknown) => void) => {
  return getWindowDataInstance().viewInsertObservable.subscribe(subscribe);
};
export const getWCache = (id: string) => {
  return getWindowDataInstance().data.get(id);
};

export const inertViewCache = <T, >(viewId?: string, data?: T) => {
  if (viewId) {
    getWindowDataInstance().data.set(viewId, data);
    getWindowDataInstance().viewInsertObservable.next({
      viewId,
      data,
    });
  }
};