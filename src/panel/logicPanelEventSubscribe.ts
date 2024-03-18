import { ReplaySubject } from 'rxjs';
import { createSingleInstance } from '../comp/createSingleInstance.ts';
import { ILogicNode } from '../store/slice/logicSlice.ts';

type nodeId = string
const panelSubscribe = () => {
  const logicNodes = new Map<nodeId, ILogicNode>();
  const createObservable = new ReplaySubject<ILogicNode>();
  const updateObservable = new ReplaySubject<ILogicNode>();
  const updateEdgeObservable = new ReplaySubject<{ source: string, target: string }[]>();
  return {
    logicNodes,
    createObservable,
    updateEdgeObservable,
    updateObservable,
  };
};
export const getPanelSubscribe = createSingleInstance(panelSubscribe);

export const subscribeCreateNode = (subscribe: (node: ILogicNode) => void) => {
  return getPanelSubscribe().createObservable.subscribe(subscribe);
};
export const subscribeUpdateNode = (subscribe: (node: ILogicNode) => void) => {
  return getPanelSubscribe().updateObservable.subscribe(subscribe);
};
export const subscribeUpdateEdge = (subscribe: (nodeEdgeList: { source: string, target: string }[]) => void) => {
  return getPanelSubscribe().updateEdgeObservable.subscribe(subscribe);
};
export const updateNode = (node: ILogicNode) => {
  getPanelSubscribe().updateObservable.next(node);
};
export const updateEdge = (nodeIdList: { source: string, target: string }[]) => {
  getPanelSubscribe().updateEdgeObservable.next(nodeIdList);
};
export const createNode = (node: ILogicNode) => {
  getPanelSubscribe().logicNodes.set(node.id, node);
  getPanelSubscribe().createObservable.next(node);
};
export const deleteNode = (node: ILogicNode) => {
  getPanelSubscribe().logicNodes.delete(node.id);
};