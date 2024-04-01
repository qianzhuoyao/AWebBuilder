import { INodeType, pic_Img, pix_BX, pix_Table } from '../store/slice/nodeSlice.ts';
import pic from '../assets/widgetIcon/photo.svg';
import { CHART_OPTIONS } from '../Setting/attrConfig/view/CHART_OPTIONS.ts';

export const parseFnContent = (str: string) => {
  const value = str.match(/{([\s\S]*)}/);
  return value ? value[0].slice(1).slice(0, -1) : '';
};

export const viewFnString = (body: string) => {
  return `
  ${body}
  `;
};

export const runViewFnString = (body: string) => {
  return `
  function builder(params,echarts){
  ${body}
  }
  `;
};

export const TABLE_DEFAULT_OPTION = {
  colField: 'col',
  colLabel: 'label',
  colProp: 'prop',
  dataField: 'data',
};

export const IMAGE_DEFAULT_OPTION = {
  src: pic,
} as const

export const setDefaultChartOption = (type: INodeType) => {
  switch (type) {
    case pix_BX:
      return {
        chartClass:'DEFAULT_BAR',
        chart: CHART_OPTIONS['DEFAULT_BAR'],
      };
    case pix_Table:
      return TABLE_DEFAULT_OPTION;
    case pic_Img:
      return IMAGE_DEFAULT_OPTION;
    default:
      return undefined;
  }
};