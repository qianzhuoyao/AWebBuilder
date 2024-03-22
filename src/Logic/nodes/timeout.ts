import { signalLogicNode } from '../base.ts';
import { logic_TO_get } from '../../store/slice/nodeSlice.ts';
import time from '../../assets/widgetIcon/carbon--time.svg';
import { tap, delay, of } from 'rxjs';
import { getSyncTimeOutConfig } from '../../Setting/form/logic/timer/timeOut.tsx';
import { ITimerOutConfigInfo } from './logicConfigMap.ts';


//检查器
export const timeOut = () => {

  const TimeOut = signalLogicNode<
    { timerOutConfigInfo: ITimerOutConfigInfo },
    unknown,
    unknown
  >({
    id: logic_TO_get,
    type: 'timeOut',
    src: time,
    tips: '收到信号后延迟N秒发出',
    name: '延时器',
  });
  TimeOut.signalIn('in-0', (value) => {
    console.log('biff');
    return of(value?.pre);
  });

  TimeOut.signalOut('out', (value) => {

    return of(value?.pre).pipe(
      tap(() => {
        getSyncTimeOutConfig().subject.next({
          status: true,
        });
      }),
      delay(value.config.timerOutConfigInfo.timeOut || 10000),
      tap(() => {
        getSyncTimeOutConfig().subject.next({
          status: false,
        });
      }),
    );
  });
};