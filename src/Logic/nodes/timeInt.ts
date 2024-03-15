import { signalLogicNode } from '../base.ts';
import { logic_Ring_get } from '../../store/slice/nodeSlice.ts';
import ring from '../../assets/widgetIcon/icon-park--cross-ring-two.svg';

interface IDataReq {
  data: number;
}

//检查器
export const timeInter = () => {

  const TimeInter = signalLogicNode<IDataReq, IDataReq>({
    id: logic_Ring_get,
    type: 'timeInter',
    src: ring,
    tips: '收到信号后循环发出信号,指导1端口收到信号止',
    name: '循环',
  });

  TimeInter.signalIn('in-go', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  TimeInter.signalIn('in-stop', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });
  TimeInter.signalOut((params) => {
    console.log({
      params,
    });
    return new Promise(resolve => {
     setTimeout(()=>{
       resolve({
         data: 12,
       });
     },3000)
    });
  });

};