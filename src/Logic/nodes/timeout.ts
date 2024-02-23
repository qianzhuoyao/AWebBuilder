import { signalLogicNode } from '../base.ts';
import { logic_TO_get } from '../../store/slice/nodeSlice.ts';
import time from '../../assets/widgetIcon/carbon--time.svg';

interface IDataReq {
  data: number;
}

//检查器
export const timeOut = () => {

  const TimeOut = signalLogicNode<IDataReq, IDataReq>({
    id: logic_TO_get,
    type: 'timeOut',
    src: time,
    tips: '收到信号后延迟N秒发出',
    name: '延时器',
  });
  TimeOut.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  TimeOut.signalOut((params) => {
    console.log({
      params,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

};