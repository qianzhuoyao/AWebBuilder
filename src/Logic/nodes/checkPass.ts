import { signalLogicNode } from '../base.ts';
import { logic_P_get } from '../../store/slice/nodeSlice.ts';
import checkPass from '../../assets/widgetIcon/check-pass.svg';
import { of } from 'rxjs';

//检查器
export const checkPassword = () => {

  const CheckPassword = signalLogicNode({
    id: logic_P_get,
    type: 'filter',
    src: checkPass,
    tips: '校验信号数据并将其限制,满足条件即放行否则拦截并丢弃',
    name: '检查器',
  });
  CheckPassword.signalIn('in',()=>{
    return of(1)
  })
  CheckPassword.signalOut('out',()=>{
    return of(1)
  })


};