import { signalLogicNode } from '../base.ts';
import { logic_View_bind } from '../../store/slice/nodeSlice.ts';
import mapSrc from '../../assets/widgetIcon/oi--project.svg';
import { of } from 'rxjs';


//检查器
export const viewLogicSlot = () => {

  const ViewLogicSlot = signalLogicNode<any>({
    id: logic_View_bind,
    type: 'viewSlot',
    src: mapSrc,
    tips: '将组件映射至逻辑层,与事件同与门时,触发事件',
    name: '绑定器',
  });
  ViewLogicSlot.signalIn('in-0', (value) => {
    console.log(value,'biff');
    return of(1);
  });

  ViewLogicSlot.signalOut('out', () => {
    return of(2);
  });

};