import React, { useEffect } from 'react';
import { AttrConfigInit, setDefaultLogicConfig } from './logic';
import { AttrViewConfigInit, setDefaultPanelViewConfig } from './view';

//默认配置项注册
export const useAttrSet = (deps?: React.DependencyList) => {
  useEffect(() => {
    setDefaultLogicConfig();
    setDefaultPanelViewConfig();
    AttrConfigInit();
    AttrViewConfigInit();
  }, [deps]);
};