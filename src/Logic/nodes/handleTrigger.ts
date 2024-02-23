import { signalLogicNode } from '../base.ts';
import { logic_Dug_Trigger } from '../../store/slice/nodeSlice.ts';
import trigger from '../../assets/widgetIcon/game-icons--click.svg';
import dayjs from 'dayjs'


interface IDataReq {
  time: string,
}

//检查器
export const handleTrigger = () => {

  const HandleTrigger = signalLogicNode<IDataReq, IDataReq>({
    id: logic_Dug_Trigger,
    type: 'hTrigger',
    src: trigger,
    tips: '手动发送一个1信号',
    name: '触发器',
  });

  HandleTrigger.signalOut(() => {
    return new Promise(resolve => {
      resolve({
        time: dayjs().toString(),
      });
    });
  });

};