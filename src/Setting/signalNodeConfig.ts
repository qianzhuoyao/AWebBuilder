//节点配置项注册
import React from 'react';
import { ILogicConfig } from '../store/slice/logicSlice.ts';
import { createSingleInstance } from '../comp/createSingleInstance.ts';

/**
 *
 * const nodeA = signalViewNodeAttrConfig()
 * const nodeB = signalLogicNodeAttrConfig('B')
 * nodeB.setConfigEle((nodeInfo)=><>123</>)
 */




const initConfig = () => {
  const initConfigList = new Map<string, IConfig>();
  return {
    config: initConfigList,
  };
};

export const getAttrConfig = createSingleInstance(initConfig);

export type IConfig = (nodeInfo: ILogicConfig) => React.ReactNode
export const signalViewNodeAttrConfig = (nodeTypeId: string) => {
};


export const signalLogicNodeAttrConfig = (nodeTypeId: string) => {
  const config = getAttrConfig();
  const setConfigEle = (genNode: IConfig) => {
    config.config.set(nodeTypeId, genNode);
  };
  return {
    setConfigEle,
  };
};