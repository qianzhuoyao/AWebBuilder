import { signalLogicNode } from '../base.ts';
import { logic_TimesSet_get } from '../../store/slice/nodeSlice.ts';
import flowbite from '../../assets/widgetIcon/flowbite--arrows-repeat-count-outline.svg';


//输出器
export const timeSetter = () => {

  const TimeSetter = signalLogicNode({
    id: logic_TimesSet_get,
    type: 'timeInter',
    src: flowbite,
    tips: '收到信号后依次定时发送有限的N次信号',
    name: '定次器',
  });


};