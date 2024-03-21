import { signalLogicNode } from '../base.ts';
import { logic_TimesSet_get } from '../../store/slice/nodeSlice.ts';
import flowbite from '../../assets/widgetIcon/flowbite--arrows-repeat-count-outline.svg';
import { of } from 'rxjs';


//输出器
export const timeSetter = () => {

  const TimeSetter = signalLogicNode({
    id: logic_TimesSet_get,
    type: 'timeInter',
    src: flowbite,
    tips: '收到信号后依次定时发送有限的N次信号',
    name: '定次器',
  });

  TimeSetter.signalIn('in-0', (value) => {
    return of(value?.pre);
  });
  TimeSetter.signalOut('out', (value) => {
    return of(value?.pre);
  });
};