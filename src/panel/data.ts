import { createSingleInstance } from "../comp/createSingleInstance.ts";
import { ReplaySubject } from "rxjs";
import { IObjectNotNull } from "../comp/filterObjValue.ts";


type viewId = string;
const windowData = <T>() => {
  const data = new Map<viewId, IObjectNotNull<T>>();
  const viewInsertObservable = new ReplaySubject<T>();
  return {
    data,
    viewInsertObservable,
  };
};

const getWindowDataInstance = createSingleInstance(windowData);

export interface ISubscribeParams<T> {
  viewId?: string;
  data?: T;
}

export const subscribeViewCacheUpdate = <T>(
  subscribe: (
    value: ISubscribeParams<T>
  ) => void
) => {
  return getWindowDataInstance().viewInsertObservable.subscribe((value) => {
    subscribe(value as {
      viewId?: string;
      data?: T;
    })
  });
};
export const getWCache = (id: string) => {
  return getWindowDataInstance().data.get(id);
};

export const inertViewCache = <T extends IObjectNotNull<unknown>>(
  viewId?: string,
  data?: T
) => {
  if (viewId && data) {
    getWindowDataInstance().data.set(viewId, data);
    getWindowDataInstance().viewInsertObservable.next({
      viewId,
      data,
    });
  }
};
