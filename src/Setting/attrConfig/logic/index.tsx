import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { CacheSetConfig } from './cacheSetConfig.tsx';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { genLogicNodeMenuItems } from '../../../Logic/base.ts';
import { handleTrigger } from './handleTrigger.tsx';
import { viewMapping } from './viewMapping.tsx';
import { FilterDataConfig } from './filterDataConfig.tsx';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });


    console.log(logicState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <div>-</div>;
  });
};

export const AttrConfigInit = () => {
  remoteGetConfig();
  CacheSetConfig();
  handleTrigger();
  viewMapping();
  FilterDataConfig();
};