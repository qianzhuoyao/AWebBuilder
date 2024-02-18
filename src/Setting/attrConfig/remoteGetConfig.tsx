import { signalLogicNodeAttrConfig } from '../signalNodeConfig.ts';
import { logic_D_get } from '../../store/slice/nodeSlice.ts';

export const remoteGetConfig = () => {

  const config = signalLogicNodeAttrConfig(logic_D_get);
  config.setConfigEle(nodeInfo => {
    console.log(nodeInfo);
    if (nodeInfo.target.length > 0) {
      return <>22222</>;
    }
  });

};