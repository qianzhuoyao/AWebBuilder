import { signalLogicNode } from '../base.ts';
import { logic_Dug_Trigger } from '../../store/slice/nodeSlice.ts';
import trigger from '../../assets/widgetIcon/game-icons--click.svg';

interface IDataReq {
  data: number;
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

  HandleTrigger.signalOut((params) => {
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