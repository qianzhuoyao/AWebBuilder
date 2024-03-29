import { useEffect, useState } from 'react';
import { ILogicNode, ILs } from '../store/slice/logicSlice.ts';
import { useSelector } from 'react-redux';
import { IWls } from '../store/slice/widgetSlice.ts';
import { findLogicNodesInLayer, findViewNodesInLayer, getLayerContent, getLayers } from './layers.ts';
import { INs, IViewNode } from '../store/slice/nodeSlice.ts';

export const useFilterLogicNode = () => {
  const [layerLogicNode, setLayerLogicNode] = useState<ILogicNode[]>([]);
  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  useEffect(() => {
    setLayerLogicNode(() => {
      return [...Object.values(logicState.logicNodes)]
        .filter(node => {
          return findLogicNodesInLayer(
            getLayerContent(
              widgetState.currentLayerId,
            )?.layerNameNodesOfLogic || '',
          )?.has(node.id);
        });
    });
  }, [logicState.logicNodes, widgetState.currentLayerId]);
  return layerLogicNode;
};

export const useFilterViewNode = () => {
  const [layerViewNode, setLayerViewNode] = useState<IViewNode[]>([]);
  const widgetState = useSelector((state: { widgetSlice: IWls }) => {
    return state.widgetSlice;
  });
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  useEffect(() => {
    console.log(NodesState.list,getLayers(),'NodesState.list-0s')
    setLayerViewNode(() => {
      return [...Object.values(NodesState.list)]
        .filter(node => {
          return findViewNodesInLayer(
            getLayerContent(
              widgetState.currentLayerId,
            )?.layerNameNodesOfView || '',
          )?.has(node.id);
        });
    });
  }, [NodesState.list, widgetState.currentLayerId]);
  return layerViewNode;
};
