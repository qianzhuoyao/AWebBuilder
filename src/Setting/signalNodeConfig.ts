//节点配置项注册
import React from 'react';
import { createSingleInstance } from '../comp/createSingleInstance.ts';

/**
 *
 * const nodeA = signalViewNodeAttrConfig()
 * const nodeB = signalLogicNodeAttrConfig('B')
 * nodeB.setConfigEle((nodeInfo)=><>123</>)
 */




const initConfig = () => {
  const initConfigList = new Map<string, IConfig>();
  const initViewConfigList = new Map<string, IConfig>();
  return {
    config: initConfigList,
    viewConfig: initViewConfigList,
  };
};

export const getAttrConfig = createSingleInstance(initConfig);

export type IConfig = (nodeInfo: { target: string[] }) => React.ReactNode
//注册视图节点配置
export const signalViewNodeAttrConfig = (nodeViewTypeId: string) => {
  const config = getAttrConfig();
  const setConfigEle = (genNode: IConfig) => {
    config.viewConfig.set(nodeViewTypeId, genNode);
  };
  return {
    setConfigEle,
  };
};


//注册逻辑节点配置
export const signalLogicNodeAttrConfig = (nodeTypeId: string) => {
  const config = getAttrConfig();
  const setConfigEle = (genNode: IConfig) => {
    config.config.set(nodeTypeId, genNode);
  };
  return {
    setConfigEle,
  };
};