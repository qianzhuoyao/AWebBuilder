import { Observable, of } from "rxjs";
import { createSingleInstance } from "../../comp/createSingleInstance.ts";

type nodeId = string;
type logicId = string;
const emitLogicId = () => {
  //一个点应该对应多个逻辑线
  const emitNodeToLogicIdMap = new Map<nodeId, Set<logicId>>();
  return {
    emitNodeToLogicIdMap,
  };
};

export const getEmitLogicId = createSingleInstance(emitLogicId);

export const pushLogicMap = (nodeId: string, logicId: string) => {
  if (!getEmitLogicId().emitNodeToLogicIdMap.has(nodeId)) {
    getEmitLogicId().emitNodeToLogicIdMap.set(nodeId, new Set<logicId>());
  }
  getEmitLogicId().emitNodeToLogicIdMap.get(nodeId)?.add(logicId);
};

export const clearLogicMap = (nodeId: string) => {
  getEmitLogicId().emitNodeToLogicIdMap.get(nodeId)?.clear();
};

export const isLogicFromNode = (logicId: string, nodeId: string) => {
  return getEmitLogicId().emitNodeToLogicIdMap.get(nodeId)?.has(logicId);
};

export const emitLogic = (): Observable<string> => {
  return of("trigger");
};
