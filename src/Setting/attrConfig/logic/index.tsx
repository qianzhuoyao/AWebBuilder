import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { CacheSetConfig } from './cacheSetConfig.tsx';
import { useSelector } from 'react-redux';
import { ILs } from '../../../store/slice/logicSlice.ts';
import { genLogicNodeMenuItems } from '../../../Logic/base.ts';
import { useSignalMsg } from '../../../comp/msg.tsx';
import { handleTrigger } from './handleTrigger.tsx';
import { viewMapping } from './viewMapping.tsx';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    const logicState = useSelector((state: { logicSlice: ILs }) => {
      return state.logicSlice;
    });

    const { go } = useSignalMsg(Object.keys(logicState.logicNodes)[0]);
    const handleClick = () => {
      go();
    };

    console.log(logicState, genLogicNodeMenuItems(), 'cascascascascasc');
    return <div onClick={handleClick}>333333</div>;
  });
};

export const AttrConfigInit = () => {
  remoteGetConfig();
  CacheSetConfig();
  handleTrigger();
  viewMapping();
};