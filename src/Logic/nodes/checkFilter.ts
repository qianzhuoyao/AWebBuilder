import { signalLogicNode } from '../base.ts';
import { logic_FilterCheckData_get } from '../../store/slice/nodeSlice.ts';
import filterPipe from '../../assets/widgetIcon/mdi--pipe.svg';
import { of } from 'rxjs';


//检查器
export const checkFilter = () => {

  const CheckFilter = signalLogicNode({
    id: logic_FilterCheckData_get,
    type: 'filter',
    src: filterPipe,
    tips: '过滤管道值',
    name: '筛选器',
  });
  CheckFilter.signalIn('in', () => {
    return of(1);
  });
  CheckFilter.signalOut('out', () => {
    return of(1);
  });

};