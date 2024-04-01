import { ReplaySubject } from "rxjs";
import { createSingleInstance } from "../comp/createSingleInstance.ts";
import { ILogicNode } from "../store/slice/logicSlice.ts";

type nodeId = string;

const panelSubscribe = () => {
  const logicNodesConfig = new Map<nodeId, ILogicNode>();
  const createObservable = new ReplaySubject<ILogicNode>();
  const updateObservable = new ReplaySubject<ILogicNode>();
  const updateEdgeObservable = new ReplaySubject<{
    fromNodeId: string;
    nodeIdList: { source: string; target: string }[];
  }>();
  return {
    logicNodesConfig,
    createObservable,
    updateEdgeObservable,
    updateObservable,
  };
};

export const getPanelSubscribe = createSingleInstance(panelSubscribe);

export const logicNodesConfigToJSON = () => {
  const target: Record<string, ILogicNode | null> = {};
  [...getPanelSubscribe().logicNodesConfig.keys()].map((key) => {
    target[key] = getPanelSubscribe().logicNodesConfig.get(key) || null;
  });
  return JSON.stringify(target);
};

export const subscribeCreateNode = (subscribe: (node: ILogicNode) => void) => {
  return getPanelSubscribe().createObservable.subscribe(subscribe);
};

export const subscribeUpdateNode = (subscribe: (node: ILogicNode) => void) => {
  return getPanelSubscribe().updateObservable.subscribe(subscribe);
};

export const subscribeUpdateEdge = (
  subscribe: (params: {
    fromNodeId: string;
    nodeIdList: { source: string; target: string }[];
  }) => void
) => {
  return getPanelSubscribe().updateEdgeObservable.subscribe(subscribe);
};

export const updateNode = (node: ILogicNode) => {
  getPanelSubscribe().updateObservable.next(node);
};

export const updateEdge = (
  fromNodeId: string,
  nodeIdList: { source: string; target: string }[]
) => {
  getPanelSubscribe().updateEdgeObservable.next({ fromNodeId, nodeIdList });
};

export const createNode = (node: ILogicNode) => {
  getPanelSubscribe().logicNodesConfig.set(node.id, node);
  getPanelSubscribe().createObservable.next(node);
};

export const deleteSubNode = (node: ILogicNode) => {
  getPanelSubscribe().logicNodesConfig.delete(node.id);
};
