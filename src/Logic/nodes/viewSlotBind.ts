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
    tips: '将组件映射至逻辑层并绑定操作与数据',
    name: '映射器',
  });
  ViewLogicSlot.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
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