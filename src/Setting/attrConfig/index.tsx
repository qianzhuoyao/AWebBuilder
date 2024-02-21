import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../signalNodeConfig.ts';
import { CacheSetConfig } from './cacheSetConfig.tsx';
import { getWDGraph } from '../../DirGraph/weightedDirectedGraph.ts';
import { useSelector } from 'react-redux';
import { ILs } from '../../store/slice/logicSlice.ts';
import { genLogicNodeMenuItems } from '../../Logic/base.ts';
import { useSignalMsg } from '../../comp/msg.tsx';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });
    console.log(logicState,genLogicNodeMenuItems(),'cascascascascasc');
    return <>333333</>;
  });
};

export const AttrConfigInit = () => {
  remoteGetConfig();
  CacheSetConfig()
};