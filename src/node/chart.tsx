import { memo, useEffect, useId, useRef } from 'react';
import * as Echart from 'echarts';
import { INodeType } from '../store/slice/nodeSlice';
import { isEqual } from 'lodash';
import { EChartsType } from 'echarts';

interface IBaseChart {
  options?: Echart.EChartsOption;
  width: number;
  height: number;
  type: INodeType;
}

export const BaseChart = memo((chartParams: IBaseChart) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instance = useRef<{
    option: unknown
    ChartInstance: EChartsType | null
  }>({
    option: null,
    ChartInstance: null,
  });
  const size = useRef<{
    width: number,
    height: number,
  }>({
    width: 0,
    height: 0,
  });
  const chartId = useId();

  useEffect(() => {
    const CRvar = chartRef.current;
    instance.current.ChartInstance = instance.current.ChartInstance || Echart.init(CRvar);
    // return () => {
    //   instance.current.ChartInstance.dispose();
    // };
  }, []);

  useEffect(() => {

    const CRvar = chartRef.current;
    console.log(CRvar, chartParams, instance.current.ChartInstance, isEqual(instance.current.option, chartParams.options), 'RdddddchartParamsdasdaS');

    if (CRvar) {
      if (chartParams.options) {
        if (!isEqual(instance.current.option, chartParams.options)) {
          instance.current.ChartInstance?.clear();
          instance.current.ChartInstance?.setOption(chartParams.options);
          instance.current.option = chartParams.options;
        }

      }
      const R = new ResizeObserver(() => {

        if (chartRef.current) {
          const { height, width } = chartRef.current.getBoundingClientRect();
          console.log(size, chartRef.current?.getBoundingClientRect(), 'RddddddasdaS');
          if (size.current.width !== width || size.current.height !== height) {

            instance.current.ChartInstance?.resize();
            size.current.width = width;
            size.current.height = height;
          }
        }
      });
      R.observe(CRvar);

      return () => {

        CRvar && R.unobserve(CRvar);
        R.disconnect();
      };
    }
  }, [chartParams, chartParams.options]);

  return (
    <>
      {
        chartParams.options ? <div
          ref={chartRef}
          id={chartId}
          style={{
            width: chartParams.width + 'px',
            height: chartParams.height + 'px',
          }}
          //   className={`w-[${chartParams.width}px] h-[${chartParams.height}px]`}
        ></div> : <div
          style={{
            width: chartParams.width + 'px',
            height: chartParams.height + 'px',
          }}
        >待解析</div>
      }</>

  );
});
