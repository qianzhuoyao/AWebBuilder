import { createSingleInstance } from "../../../../comp/createSingleInstance.ts";

type viewId = string;
type bindNodeLogicId = string;
const bindNodeMappingLogic = () => {
  const mapInfo = new Map<viewId, bindNodeLogicId>();
  const reMap = new Map<bindNodeLogicId, viewId>();
  return {
    mapInfo,
    reMap,
  };
};
export const getBindNodeMappingLogic =
  createSingleInstance(bindNodeMappingLogic);

export const createBindMap = (
  viewId?: viewId,
  bindNodeLogicId?: bindNodeLogicId
) => {
  if (viewId && bindNodeLogicId) {
    getBindNodeMappingLogic().mapInfo.set(viewId, bindNodeLogicId);
    getBindNodeMappingLogic().reMap.set(bindNodeLogicId, viewId);
  }
};

export const removeBindMap = (bindNodeLogicId: bindNodeLogicId) => {
  getBindNodeMappingLogic().mapInfo.delete(
    getBindNodeMappingLogic().reMap.get(bindNodeLogicId) || ""
  );
  getBindNodeMappingLogic().reMap.delete(bindNodeLogicId);
};

export const hasBindViewMap = (viewId: viewId) => {
  return getBindNodeMappingLogic().mapInfo.has(viewId);
};
export const hasBindLogicMap = (bindNodeLogicId: bindNodeLogicId) => {
  return getBindNodeMappingLogic().reMap.has(bindNodeLogicId);
};
