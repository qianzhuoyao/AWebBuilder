import { signalLogicNode } from '../base.ts';
import { logic_MixData_get } from '../../store/slice/nodeSlice.ts';
import mix from '../../assets/widgetIcon/mdi--instant-mix.svg';
import { filterObjValue } from '../../comp/filterObjValue.ts';

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


    const res =
      fromNodes.logicNode.configInfo?.mixDataFieldMap?.fieldString ?
        filterObjValue(fromNodes.data.data.data, fromNodes.logicNode.configInfo?.mixDataFieldMap?.fieldString || '')
        : fromNodes.data.data.data;
    console.log(fromNodes,res, 'sdffffMapMixDataff');
    return new Promise(resolve => {
      resolve({
        data: res,
      });
    });
  });

  MapMixData.signalOut((params) => {
    console.log({
      params,
    },'ccccccccscacascMapMixDataascascas');
    return new Promise(resolve => {
      resolve({
        data: params?.data,
      });
    });
  });

};