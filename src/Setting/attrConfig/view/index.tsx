import { PixBXChartConfig } from './pixBXchartConfig.tsx';
import { signalViewNodeAttrConfig } from '../../signalNodeConfig.ts';
import { genLogicNodeMenuItems } from '../../../Logic/base.ts';
import { INs } from '../../../store/slice/nodeSlice.ts';
import { DefaultPanelSetting } from './panelSet.tsx';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { TableConfig } from './table.tsx';


export const setDefaultPanelViewConfig = ({NodesState}:{NodesState:INs}) => {
  const config = signalViewNodeAttrConfig('DEFAULT-VIEW-PANEL-CONFIG');
  config.setConfigEle(() => {
    console.log(NodesState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <><DefaultPanelSetting /></>;
  });
};

export const AttrViewConfigInit = ({NodesState,logicState}:{NodesState:INs,logicState:ILs}) => {
  PixBXChartConfig({NodesState,logicState});
  TableConfig({NodesState,logicState})
};