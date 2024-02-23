import { memo, useEffect, useId, useRef } from 'react';
import * as Echart from 'echarts';
import { INodeType } from '../store/slice/nodeSlice';


interface IBaseChart {
  options?: Echart.EChartsOption;
  width: number;
  height: number;
  type: INodeType;
}

export const BaseChart = memo((chartParams: IBaseChart) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartId = useId();

  useEffect(() => {
    //销毁指向
    const CRvar = chartRef.current;

    if (CRvar) {
      const ChartInstance = Echart.init(CRvar);

      if (chartParams.options) {
        ChartInstance.setOption(chartParams.options);
      }
      const R = new ResizeObserver(() => {
        console.log('RddddddasdaS');
        ChartInstance.resize();
      });
      R.observe(CRvar);

      return () => {
        ChartInstance.dispose();
        CRvar && R.unobserve(CRvar);
        R.disconnect();
      };
    }
  }, [chartParams.options, chartParams.type]);

  return (
    <>{
      chartParams.options ? <div
        ref={chartRef}
        id={chartId}
        style={{
          width: chartParams.width + 'px',
          height: chartParams.height + 'px',
        }}
        //   className={`w-[${chartParams.width}px] h-[${chartParams.height}px]`}
      ></div> : <>empty</>
    }</>

  );
});
