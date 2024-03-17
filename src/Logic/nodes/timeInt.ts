import { signalLogicNode } from '../base.ts';
import { logic_Ring_get } from '../../store/slice/nodeSlice.ts';
import ring from '../../assets/widgetIcon/icon-park--cross-ring-two.svg';
import { of, interval, takeWhile } from 'rxjs';
import { MUST_FORCE_STOP_SE } from '../../contant';
import { createSingleInstance } from '../../comp/createSingleInstance.ts';
import { getSyncTimeIntConfig } from '../../Setting/form/logic/timer/timeConfig.tsx';


const intTimer = () => {
  const timer = new Map<string, boolean>();
  return {
    timer,
  };
};


export const getInitTimer = createSingleInstance(intTimer);
//循环器
export const timeInter = () => {


  const TimeInter = signalLogicNode<any>({
    id: logic_Ring_get,
    type: 'timeInter',
    src: ring,
    tips: '收到信号后循环发出信号,指导1端口收到信号止',
    name: '循环',
  });

  TimeInter.signalIn('in-go', (value) => {
    return of(value);
  });

  TimeInter.signalIn('in-stop', (value) => {
    getInitTimer().timer.set(value.id, false);
    getSyncTimeIntConfig().subject.next({
      status: false,
    });
    return of(MUST_FORCE_STOP_SE);
  });

  TimeInter.signalOut('out', (value) => {
    console.log(value, 'ddddds-s');
    getInitTimer().timer.set(value.id, true);
    getSyncTimeIntConfig().subject.next({
      status: true,
    });
    return interval(value.config.timerConfigInfo.time || 1000).pipe(
      takeWhile(() => {
        return !!getInitTimer().timer.get(value.id);
      }),
    );
  });
};