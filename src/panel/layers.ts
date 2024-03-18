import { createSingleInstance } from '../comp/createSingleInstance.ts';

type layerName = string
type symbolId = string
const layers = () => {
  const logicAllLayers = new Map<layerName, symbolId[]>;
  const viewAllLayers = new Map<layerName, symbolId[]>;
  return {
    logicAllLayers,
    viewAllLayers,
  };
};

export const getLayers = createSingleInstance(layers);

export const findViewLayer = (layerName: string) => {
  return getLayers().viewAllLayers.get(layerName);
};
export const updateViewLayer = (layerName: string, symbolIds: symbolId[]) => {
  getLayers().viewAllLayers.set(layerName, symbolIds);
};
export const removeViewLayers = (layerName: string) => {
  return getLayers().viewAllLayers.delete(layerName);
};


export const findLogicLayer = (layerName: string) => {
  return getLayers().logicAllLayers.get(layerName);
};
export const updateLogicLayer = (layerName: string, symbolIds: symbolId[]) => {
  getLayers().logicAllLayers.set(layerName, symbolIds);
};
export const removeLogicLayers = (layerName: string) => {
  return getLayers().logicAllLayers.delete(layerName);
};
