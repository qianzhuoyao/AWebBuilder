import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { handleTrigger } from './handleTrigger.tsx';
import { viewMapping } from './viewMapping.tsx';
import { TimerIntConfig } from './timerIntConfig.tsx';
import { IConfigTypeParams } from './configType.ts';
import { TimerOutConfig } from './timeOutConfig.tsx';
import { FormConfig } from './formConfig.tsx';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    return <div>-</div>;
  });
};

export const AttrConfigInit = (configParams: IConfigTypeParams) => {
  remoteGetConfig();
  FormConfig();
  // handleMixConfig(configParams);
  TimerOutConfig();
  // CacheSetConfig(configParams);
  handleTrigger();
  TimerIntConfig();
  viewMapping();
  // FilterDataConfig(configParams);
};