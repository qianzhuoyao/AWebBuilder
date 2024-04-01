import { signalLogicNodeAttrConfig } from "../../signalNodeConfig.ts";
import { logic_Cache_set } from "../../../store/slice/nodeSlice.ts";

export const CacheSetConfig = () => {
  const config = signalLogicNodeAttrConfig(logic_Cache_set);
  config.setConfigEle((nodeInfo) => {
    if (nodeInfo.target.length > 0) {
      return <>1234</>;
    }
  });
};
