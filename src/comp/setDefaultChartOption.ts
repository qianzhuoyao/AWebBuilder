import { INodeType, pix_BX } from '../store/slice/nodeSlice.ts';
import { defaultBuilderFn } from '../Setting/form/view/PixBXChartConfigCode.tsx';


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
  function builder(params){
  ${body}
  }
  `;
};

export const setDefaultChartOption = (type: INodeType) => {
  switch (type) {
    case pix_BX:
      return defaultBuilderFn;
    default:
      return undefined;
  }
};