import { signalLogicNode } from '../base.ts';
import { logic_Roll_get } from '../../store/slice/nodeSlice.ts';
import roll from '../../assets/widgetIcon/tabler--blend-mode.svg';
import { of } from 'rxjs';

//打平器
export const rollPick = () => {


  const RollPick = signalLogicNode({
    id: logic_Roll_get,
    type: 'viewSlot',
    src: roll,
    tips: '执行最近一次的逻辑节点,当存在惰节点时方便使用',
    name: '打平器',
  });

  RollPick.signalIn('roll', (value) => {
    return of(value?.pre);
  });

};