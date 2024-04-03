//注册视图节点模板(物料)

import { ReactNode } from "react";
import { IClassify, INs, IViewNode } from "../store/slice/nodeSlice";
import { createSingleInstance } from "../comp/createSingleInstance";
import { IPs } from "../store/slice/panelSlice";

/**
 * 不涉及逻辑
 * 但是应暴露一个句柄供视图逻辑节点连接（映射）
 * 目前直接去WidgetMenu 设置
 *
 *
 * const Chart = signalViewNode(PX_BAR)
 *
 */

interface IMount {
  isInit: boolean;
  PanelState: IPs;
  NodesState: INs;
  id: string;
}
type ICreator = (prop: IViewNode, mountedProp: IMount) => ReactNode;

const NodeTemplate = () => {
  const template = new Map<IClassify, ICreator>();
  return {
    template,
  };
};

const getNodeTemplate = createSingleInstance(NodeTemplate);

export const getTemplate = (classify: IClassify) => {
  return getNodeTemplate().template.get(classify);
};

export const signalViewNode = (classify: IClassify) => {
  return {
    createElement: (creator: ICreator) => {
      getNodeTemplate().template.set(classify, creator);
    },
  };
};
