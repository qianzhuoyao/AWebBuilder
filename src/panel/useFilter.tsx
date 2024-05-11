import { useEffect, useState } from "react";
import { ILogicNode } from "../store/slice/logicSlice.ts";
import { useSelector } from "react-redux";
import { IWls } from "../store/slice/widgetSlice.ts";
import {
  findLogicNodesInLayer,
  findViewNodesInLayer,
  getLayerContent,
} from "./layers.ts";
import {  IViewNode } from "../store/slice/nodeSlice.ts";
import { useTakeNodeData } from "../comp/useTakeNodeData.tsx";
import { useTakeLogicData } from "../comp/useTakeLogicData.tsx";
import { useTakeWidget } from "../comp/useTakeStore.tsx";

export const useFilterLogicNode = () => {
  const [layerLogicNode, setLayerLogicNode] = useState<ILogicNode[]>([]);
  const widgetState = useTakeWidget()
  const logicState = useTakeLogicData()
  useEffect(() => {
    setLayerLogicNode(() => {
      return [...Object.values(logicState.logicNodes)].filter((node) => {
        return findLogicNodesInLayer(
          getLayerContent(widgetState.currentLayerId)?.layerNameNodesOfLogic ||
            ""
        )?.has(node.id);
      });
    });
  }, [logicState.logicNodes, widgetState.currentLayerId]);
  return layerLogicNode;
};

export const useFilterViewNode = () => {
  const [layerViewNode, setLayerViewNode] = useState<IViewNode[]>([]);
  const widgetState = useTakeWidget()
  const NodesState = useTakeNodeData()

  useEffect(() => {
    setLayerViewNode(() => {
      console.log(NodesState,'NodesStatess')
      return [...Object.values(NodesState.list)].filter((node) => {
        return findViewNodesInLayer(
          getLayerContent(widgetState.currentLayerId)?.layerNameNodesOfView ||
            ""
        )?.has(node.id);
      });
    });
  }, [NodesState.list, widgetState.currentLayerId]);
  return layerViewNode;
};
