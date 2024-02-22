import { INodeType, pix_BX } from '../store/slice/nodeSlice.ts';

const barDefaultOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
    },
  ],
};

export const setDefaultChartOption = (type: INodeType) => {
  switch (type) {
    case pix_BX:
      return barDefaultOption;
    default:
      return undefined;
  }
};