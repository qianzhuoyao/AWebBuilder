import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance.ts";

interface ISubject {
  nodeId: string;
}
interface IPayload {
  payload: string;
}
const viewObj = () => {
  const observable = new ReplaySubject<ISubject & IPayload>();
  return {
    observable,
  };
};
export const getEmit = createSingleInstance(viewObj);

//通知模板更新
export const dispatchViewUpdate = (nodeId: string, payload: string) => {
  getEmit().observable.next({ nodeId, payload });
};
//接收模板更新
export const viewUpdateReducer = (
  nodeId: string,
  callback: (params: ISubject & IPayload) => void
) => {
  return getEmit().observable.subscribe((value) => {
    if (nodeId === value.nodeId) {
      callback(value);
    }
  });
};
