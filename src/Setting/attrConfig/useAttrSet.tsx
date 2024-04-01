import React, { useEffect } from "react";
import { AttrConfigInit, DefaultLogicConfig } from "./logic";
import { AttrViewConfigInit, DefaultPanelViewConfig } from "./view";
import { useSelector } from "react-redux";
import { INs } from "../../store/slice/nodeSlice.ts";
import { ILs } from "../../store/slice/logicSlice.ts";

//默认配置项注册
export const useAttrSet = (deps?: React.DependencyList) => {
  const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
    return state.viewNodesSlice;
  });
  const logicState = useSelector((state: { logicSlice: ILs }) => {
    return state.logicSlice;
  });
  useEffect(() => {
    DefaultLogicConfig();
    DefaultPanelViewConfig({ NodesState });
    AttrConfigInit({ NodesState, logicState });
    AttrViewConfigInit({ NodesState, logicState });
  }, [NodesState, deps, logicState]);
};
