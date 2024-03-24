import { signalLogicNode } from '../base.ts';
import { logic_MixData_get } from '../../store/slice/nodeSlice.ts';
import filter from '../../assets/widgetIcon/mdi--filter.svg';
import { of, map } from 'rxjs';
import { createSingleInstance } from '../../comp/createSingleInstance.ts';
import { IMixDataFieldMap } from './logicConfigMap.ts';
import { filterObjValue } from '../../comp/filterObjValue.ts';


const intMixData = () => {
  const mix = new Map<string, boolean>();
  return {
    mix,
  };
};


export const getMixData = createSingleInstance(intMixData);

//检查器
export const filterMixData = () => {

  const FilterMixData =
    signalLogicNode<
      { mixDataFieldMap: IMixDataFieldMap },
      unknown,
      unknown
    >({
      id: logic_MixData_get,
      type: 'filter',
      src: filter,
      tips: '通过点取值的方式简单的筛选流传入的对象下数据',
      name: '取值器',
    });
  FilterMixData.signalIn('in', () => {
    return of(1);
  });
  FilterMixData.signalOut<any>('out', (value) => {
    return of(value.pre).pipe(
      map(stream => {
        return filterObjValue<any>(stream, value.config.mixDataFieldMap.fieldString);
      }),
    );
  });

};