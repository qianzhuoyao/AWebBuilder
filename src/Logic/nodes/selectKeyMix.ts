import { signalLogicNode } from '../base.ts';
import { logic_MixData_get } from '../../store/slice/nodeSlice.ts';
import mix from '../../assets/widgetIcon/mdi--instant-mix.svg';

interface IDataReq {
  data: number;
}

//检查器
export const mapFieldMixData = () => {

  const MapMixData = signalLogicNode<IDataReq, IDataReq>({
    id: logic_MixData_get,
    type: 'mix',
    src: mix,
    tips: '对传入的信号进行映射字段,并输出映射完毕的字段值',
    name: '映射器',
  });
  MapMixData.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  MapMixData.signalOut((params) => {
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