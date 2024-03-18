import { createSingleInstance } from '../comp/createSingleInstance.ts';
import { Subject } from 'rxjs';
import { MAIN_LAYER } from '../contant';
import { v4 } from 'uuid';

type layerName = string
type symbolNodeId = string

interface LayerStruct {
  layerName: layerName,
  layerNameNodesOfLogic: layerName,
  layerNameNodesOfView: layerName,
  layerDesc?: string,
}

const layers = () => {
  const layersMap = new Map<layerName, LayerStruct>();
  const layerNodesOfLogic = new Map<layerName, Set<symbolNodeId>>;
  const layerNodesOfView = new Map<layerName, Set<symbolNodeId>>;
  const layerCreateObservable = new Subject<LayerStruct>();
  const mainLayerNodesOfLogicId = v4();
  const mainLayerNodesOfViewId = v4();
  //主图层默认设置
  layersMap.set(MAIN_LAYER, {
    layerName: 'main',
    layerNameNodesOfLogic: mainLayerNodesOfLogicId,
    layerNameNodesOfView: mainLayerNodesOfViewId,
    layerDesc: '主图层',
  });

  return {
    layerCreateObservable,
    layersMap,
    layerNodesOfLogic,
    layerNodesOfView,
  };
};


export const getLayers = createSingleInstance(layers);


export const subscribeLayerCreate = (subscribe: (
  params: LayerStruct,
) => void) => {
  return getLayers().layerCreateObservable.subscribe(subscribe);
};


export const addLayer = (
  layerName: layerName,
  layerNameNodesOfLogic: layerName,
  layerNameNodesOfView: layerName) => {

  getLayers().layerCreateObservable.next({
    layerName,
    layerNameNodesOfLogic,
    layerNameNodesOfView,
  });
  return getLayers().layersMap.set(layerName, {
    layerName,
    layerNameNodesOfLogic,
    layerNameNodesOfView,
  });
};

export const getLayerContent = (layerName: layerName) => {
  return getLayers().layersMap.get(layerName);
};

export const findViewNodesInLayer = (layerName: string) => {
  return getLayers().layerNodesOfView.get(layerName);
};
export const updateViewNodesInLayer = (layerName: string, symbolIds: symbolNodeId) => {
  console.log(layerName, symbolIds, 'csa8symbolIds');
  if (!getLayers().layerNodesOfView.has(layerName)) {
    getLayers().layerNodesOfView.set(layerName, new Set<symbolNodeId>());
  }
  getLayers().layerNodesOfView.get(layerName)?.add(symbolIds);

};
export const removeViewNodesInLayers = (layerName: string) => {
  return getLayers().layerNodesOfView.delete(layerName);
};


export const findLogicNodesInLayer = (layerName: string) => {
  return getLayers().layerNodesOfLogic.get(layerName);
};
export const updateLogicNodesInLayer = (layerName: string, symbolIds: symbolNodeId) => {
  console.log(layerName, symbolIds, 'csa8symbolIds');
  if (!getLayers().layerNodesOfLogic.has(layerName)) {
    getLayers().layerNodesOfLogic.set(layerName, new Set<symbolNodeId>());
  }
  getLayers().layerNodesOfLogic.get(layerName)?.add(symbolIds);
};
export const removeLogicNodesInLayers = (layerName: string) => {
  return getLayers().layerNodesOfLogic.delete(layerName);
};
