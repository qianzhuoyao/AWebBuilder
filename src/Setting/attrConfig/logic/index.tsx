import { remoteGetConfig } from './remoteGetConfig.tsx';
import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { CacheSetConfig } from './cacheSetConfig.tsx';
import { handleTrigger } from './handleTrigger.tsx';
import { viewMapping } from './viewMapping.tsx';
import { FilterDataConfig } from './filterDataConfig.tsx';
import { handleMixConfig } from './mixConfig.tsx';
import { TimerIntConfig } from './timerIntConfig.tsx';
import { IConfigTypeParams } from './configType.ts';


export const setDefaultLogicConfig = () => {
  const config = signalLogicNodeAttrConfig('DEFAULT-LOGIC-PANEL-CONFIG');
  config.setConfigEle(() => {
    return <div>-</div>;
  });
};

export const AttrConfigInit = (configParams: IConfigTypeParams) => {
  remoteGetConfig(configParams);
  // handleMixConfig(configParams);
  // CacheSetConfig(configParams);
  handleTrigger(configParams);
  TimerIntConfig(configParams);
  // viewMapping(configParams);
  // FilterDataConfig(configParams);
};