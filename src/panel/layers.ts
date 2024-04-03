import { createSingleInstance } from "../comp/createSingleInstance.ts";
import { Subject } from "rxjs";
import { MAIN_LAYER } from "../contant";
import { v4 } from "uuid";

type layerName = string;
type symbolNodeId = string;

interface LayerStruct {
  layerName: layerName;
  layerNameNodesOfLogic: layerName;
  layerNameNodesOfView: layerName;
  layerDesc?: string;
}

const layers = () => {
  const layersMap = new Map<layerName, LayerStruct>();
  const layerNodesOfLogic = new Map<layerName, Set<symbolNodeId>>();
  const layerNodesOfView = new Map<layerName, Set<symbolNodeId>>();
  const layerCreateObservable = new Subject<LayerStruct>();
  const mainLayerNodesOfLogicId = v4();
  const mainLayerNodesOfViewId = v4();
  //主图层默认设置
  layersMap.set(MAIN_LAYER, {
    layerName: "main",
    layerNameNodesOfLogic: mainLayerNodesOfLogicId,
    layerNameNodesOfView: mainLayerNodesOfViewId,
    layerDesc: "主图层",
  });

  return {
    layerCreateObservable,
    layersMap,
    layerNodesOfLogic,
    layerNodesOfView,
  };
};

export const getLayers = createSingleInstance(layers);

export const subscribeLayerCreate = (
  subscribe: (params: LayerStruct) => void
) => {
  return getLayers().layerCreateObservable.subscribe(subscribe);
};

export const addLayer = (
  layerName: layerName,
  layerNameNodesOfLogic: layerName,
  layerNameNodesOfView: layerName
) => {
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

export const getLayerContentToParse = (json: string) => {
  const obj = JSON.parse(json);

  Object.keys(obj?.layersMapObj || {}).map((key) => {
    getLayers().layersMap.set(key, obj?.layersMapObj[key]);
  });
  Object.keys(obj?.layerNodesOfLogicObj || {}).map((key) => {
    const setL = new Set<string>();
    obj?.layerNodesOfLogicObj[key]?.map((ki: string) => {
      setL.add(ki);
    });

    getLayers().layerNodesOfLogic.set(key, setL);
  });
  Object.keys(obj?.layerNodesOfViewObj || {}).map((key) => {
    const setV = new Set<string>();
    obj?.layerNodesOfViewObj[key]?.map((iko: string) => {
      setV.add(iko);
    });
    getLayers().layerNodesOfView.set(key, setV);
  });
};
export const getLayerContentToJSON = () => {
  const layersMapObj: Record<string, unknown> = {};
  const layerNodesOfLogicObj: Record<string, unknown> = {};
  const layerNodesOfViewObj: Record<string, unknown> = {};
  [...getLayers().layersMap.keys()].map((i) => {
    layersMapObj[i] = getLayers().layersMap.get(i);
  });
  [...getLayers().layerNodesOfLogic.keys()].map((i) => {
    layerNodesOfLogicObj[i] = [...(getLayers().layerNodesOfLogic.get(i) || [])];
  });
  [...getLayers().layerNodesOfView.keys()].map((i) => {
    layerNodesOfViewObj[i] = [...(getLayers().layerNodesOfView.get(i) || [])];
  });

  return JSON.stringify({
    layersMapObj,
    layerNodesOfLogicObj,
    layerNodesOfViewObj,
  });
};

export const findViewNodesInLayer = (layerName: string) => {
  return getLayers().layerNodesOfView.get(layerName);
};
export const updateViewNodesInLayer = (
  layerName: string,
  symbolIds: symbolNodeId
) => {
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
export const updateLogicNodesInLayer = (
  layerName: string,
  symbolIds: symbolNodeId
) => {
  if (!getLayers().layerNodesOfLogic.has(layerName)) {
    getLayers().layerNodesOfLogic.set(layerName, new Set<symbolNodeId>());
  }
  getLayers().layerNodesOfLogic.get(layerName)?.add(symbolIds);
};
export const removeLogicNodesInLayers = (layerName: string) => {
  return getLayers().layerNodesOfLogic.delete(layerName);
};
