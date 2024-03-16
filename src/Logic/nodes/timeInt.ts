import { signalLogicNode } from '../base.ts';
import { logic_Ring_get } from '../../store/slice/nodeSlice.ts';
import ring from '../../assets/widgetIcon/icon-park--cross-ring-two.svg';
import { of, interval } from 'rxjs';

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
    return of(1);
  });

  TimeInter.signalIn('in-stop', (value) => {
    return of(1);
  });

  TimeInter.signalOut('out', (value) => {
    return interval(1000);
  });


};