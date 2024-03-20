import { signalLogicNode } from '../base.ts';
import { logic_FilterData_get } from '../../store/slice/nodeSlice.ts';
import filter from '../../assets/widgetIcon/mdi--filter.svg';


//检查器
export const filterMixData = () => {

  const FilterMixData = signalLogicNode({
    id: logic_FilterData_get,
    type: 'mix',
    src: filter,
    tips: '过滤批量的信号数据',
    name: '过滤器',
  });


};