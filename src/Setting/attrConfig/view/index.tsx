import { PixBXChartConfig } from './pixBXchartConfig.tsx';
import { signalViewNodeAttrConfig } from '../../signalNodeConfig.ts';
import { useSelector } from 'react-redux';
import { genLogicNodeMenuItems } from '../../../Logic/base.ts';
import { INs } from '../../../store/slice/nodeSlice.ts';
import { DefaultPanelSetting } from './panelSet.tsx';


export const setDefaultPanelViewConfig = () => {
  const config = signalViewNodeAttrConfig('DEFAULT-VIEW-PANEL-CONFIG');
  config.setConfigEle(() => {
    const NodesState = useSelector((state: { viewNodesSlice: INs }) => {
      return state.viewNodesSlice;
    });

    console.log(NodesState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <><DefaultPanelSetting /></>;
  });
};

export const AttrViewConfigInit = () => {
  PixBXChartConfig();
};