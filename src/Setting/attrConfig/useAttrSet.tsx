import React, { useEffect } from "react";
import { AttrConfigInit, DefaultLogicConfig } from "./logic";
import { AttrViewConfigInit, DefaultPanelViewConfig } from "./view";

import { useTakeNodeData } from "../../comp/useTakeNodeData.tsx";
import { useTakeLogicData } from "../../comp/useTakeLogicData.tsx";

//默认配置项注册
export const useAttrSet = (deps?: React.DependencyList) => {
  const NodesState = useTakeNodeData()
  const logicState = useTakeLogicData()
  useEffect(() => {
    DefaultLogicConfig();
    DefaultPanelViewConfig();
    AttrConfigInit({ NodesState, logicState });
    AttrViewConfigInit();
  }, [NodesState, deps, logicState]);
};
