import { signalLogicNode } from '../base.ts';
import { logic_TO_get } from '../../store/slice/nodeSlice.ts';
import time from '../../assets/widgetIcon/carbon--time.svg';
import { delay, of } from 'rxjs';


//检查器
export const timeOut = () => {

  const TimeOut = signalLogicNode<any>({
    id: logic_TO_get,
    type: 'timeOut',
    src: time,
    tips: '收到信号后延迟N秒发出',
    name: '延时器',
  });
  TimeOut.signalIn('in-0', () => {
    console.log('biff');
    return of(1).pipe(delay(1000));
  });

  TimeOut.signalOut('out', () => {
    return of(2);
  });


};