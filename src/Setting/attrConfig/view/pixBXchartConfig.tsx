//普通柱状图配置
import { signalViewNodeAttrConfig } from '../../signalNodeConfig.ts';
import { pix_BX } from '../../../store/slice/nodeSlice.ts';

export const PixBXChartConfig = () => {
  const config = signalViewNodeAttrConfig(pix_BX);
  config.setConfigEle(nodeInfo => {
    if (nodeInfo.target.length > 0) {
      return <>
        chart
      </>;
    }
  });
};