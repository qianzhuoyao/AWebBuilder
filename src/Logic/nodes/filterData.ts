import { signalLogicNode } from '../base.ts';
import { logic_FilterData_get } from '../../store/slice/nodeSlice.ts';
import filter from '../../assets/widgetIcon/mdi--filter.svg';
import jsonLogic from 'json-logic-js';

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
    // const res: {
    //   key: string,
    //   value: string
    // }[][] = [];
    // if (Array.isArray(fromNodes.data.data)) {
    //   fromNodes?.data?.data?.map(d => {
    //     const o: {
    //       key: string,
    //       value: string
    //     }[] = [];
    //     Object.keys(d).map(key => {
    //       o.push({
    //         key,
    //         value: d[key],
    //       });
    //     });
    //     res.push(o);
    //   });
    // }
    // console.log(fromNodes, res, 'sdffffMapMfilterMixDataixDataff');
    // const filteredData: Record<string, any> = [];
    //
    // res?.map(r => {
    //   let ro: any = {};
    //   const fr = r.filter(item => jsonLogic.apply(JSON.parse(fromNodes.logicNode.configInfo?.filterListInfo?.logic || '{}'), { streamData: item }));
    //   fr.map(fkey => {
    //     ro[fkey.key] = fkey.value;
    //   });
    //   filteredData.push(ro);
    // });
    // console.log(filteredData, res, 'svvvvsbvfilteredData');
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