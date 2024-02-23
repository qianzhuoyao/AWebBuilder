import { signalLogicNode } from '../base.ts';
import { logic_P_get } from '../../store/slice/nodeSlice.ts';
import checkPass from '../../assets/widgetIcon/check-pass.svg';

interface IDataReq {
  data: number;
}

//检查器
export const checkPassword = () => {

  const CheckPassword = signalLogicNode<IDataReq, IDataReq>({
    id: logic_P_get,
    type: 'filter',
    src: checkPass,
    tips: '校验信号数据并将其限制,满足条件即放行否则拦截并丢弃',
    name: '检查器',
  });
  CheckPassword.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  CheckPassword.signalOut((params) => {
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