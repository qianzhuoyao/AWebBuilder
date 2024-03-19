import { signalLogicNode } from '../base.ts';
import { logic_View_bind } from '../../store/slice/nodeSlice.ts';
import mapSrc from '../../assets/widgetIcon/oi--project.svg';
import { of } from 'rxjs';
import { inertViewCache } from '../../panel/data.ts';


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
    //输入 =》数据绑定
    console.log(value, 'biff');
    //
    return of(value.pre);
  });

  ViewLogicSlot.signalOut('out', (value) => {
    //输出=》事件输出
    console.log(value, 'bdiff');
    inertViewCache(value?.config?.viewMapInfo?.viewNodeId, value?.pre);
    return of(value.pre);
  });

};