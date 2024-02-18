import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../signalNodeConfig.ts';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    return <>333333</>;
  });
};

export const AttrConfigInit = () => {
  remoteGetConfig();
};