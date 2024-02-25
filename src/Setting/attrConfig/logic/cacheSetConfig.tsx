import { signalLogicNodeAttrConfig } from '../../signalNodeConfig.ts';
import { INs, logic_Cache_set } from '../../../store/slice/nodeSlice.ts';
import { ILs } from '../../../store/slice/logicSlice.ts';


export const CacheSetConfig = ({NodesState,logicState}:{NodesState:INs,logicState:ILs}) => {
  const config = signalLogicNodeAttrConfig(logic_Cache_set);
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        1234
      </>;
    }
  });
};