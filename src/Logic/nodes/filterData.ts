import { signalLogicNode } from '../base.ts';
import { logic_FilterData_get } from '../../store/slice/nodeSlice.ts';
import filter from '../../assets/widgetIcon/mdi--filter.svg';

interface IDataReq {
  data: number;
}

//检查器
export const filterMixData = () => {

  const FilterMixData = signalLogicNode<IDataReq, IDataReq>({
    id: logic_FilterData_get,
    type: 'mix',
    src: filter,
    tips: '过滤批量的信号数据',
    name: '过滤器',
  });
  FilterMixData.signalIn('in-0', ({ fromNodes }) => {
    console.log({
      fromNodes,
    });
    return new Promise(resolve => {
      resolve({
        data: 12,
      });
    });
  });

  FilterMixData.signalOut((params) => {
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