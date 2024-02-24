import { signalLogicNode } from '../base.ts';
import { logic_View_bind } from '../../store/slice/nodeSlice.ts';
import mapSrc from '../../assets/widgetIcon/oi--project.svg';

interface IDataReq {
  data: number;
}

//检查器
export const viewLogicSlot = () => {

  const ViewLogicSlot = signalLogicNode<IDataReq, IDataReq>({
    id: logic_View_bind,
    type: 'viewSlot',
    src: mapSrc,
    tips: '将组件映射至逻辑层,与事件同与门时,触发事件',
    name: '绑定器',
  });
  ViewLogicSlot.signalIn('in-0', (args) => {
    console.log(args,'viewLogicSlotsss');
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  ViewLogicSlot.signalOut((params) => {
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