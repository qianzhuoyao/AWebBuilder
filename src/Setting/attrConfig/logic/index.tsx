import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { CacheSetConfig } from './cacheSetConfig.tsx';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { genLogicNodeMenuItems } from '../../../Logic/base.ts';
import { handleTrigger } from './handleTrigger.tsx';
import { viewMapping } from './viewMapping.tsx';
import { FilterDataConfig } from './filterDataConfig.tsx';
import { handleMixConfig } from './mixConfig.tsx';
import { INs } from '../../../store/slice/nodeSlice.ts';


export const setDefaultLogicConfig = ({logicState}:{logicState:ILs}) => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    // const logicState = useSelector((state: { logicSlice: ILs }) => {
    //   return state.logicSlice;
    // });


    console.log(logicState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <div>-</div>;
  });
};

export const AttrConfigInit = ({NodesState,logicState}:{NodesState:INs,logicState:ILs}) => {
  remoteGetConfig({NodesState,logicState});
  handleMixConfig({NodesState,logicState});
  CacheSetConfig({NodesState,logicState});
  handleTrigger({NodesState,logicState});
  viewMapping({NodesState,logicState});
  FilterDataConfig({NodesState,logicState});
};