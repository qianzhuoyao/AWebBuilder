import { memo, useEffect, useId, useRef } from "react";
import * as Echart from "echarts";
import { INodeType } from "../store/slice/nodeSlice";
import { EChartsType } from "echarts";
import { useResizable } from "../comp/useResizable";

interface IBaseChart {
  options?: Echart.EChartsOption;
  width: number;
  height: number;
  type: INodeType;
}

export const BaseChart = memo((chartParams: IBaseChart) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instance = useRef<{
    width: number;
    height: number;
    ChartInstance: EChartsType | null;
  }>({
    width: 0,
    height: 0,
    ChartInstance: null,
  });

  const chartId = useId();

  const { watch, setDomObservable } = useResizable(null);
  watch((size) => {
    instance.current.ChartInstance?.resize();
    instance.current.width = size.width;
    instance.current.height = size.height;
  });

  useEffect(() => {
    const CRvar = chartRef.current;
    instance.current.ChartInstance =
      instance.current.ChartInstance || Echart.init(CRvar);
    chartRef.current && setDomObservable(chartRef.current);
    return () => {
      instance.current.ChartInstance?.dispose();
      instance.current.ChartInstance = null;
    };
  }, []);

  useEffect(() => {
    const CRvar = chartRef.current;
    if (CRvar) {
      if (chartParams.options) {
        instance.current.ChartInstance?.clear();
        instance.current.ChartInstance?.setOption(chartParams.options);
      }
    }
  }, [chartParams.options]);

  return (
    <>
      {chartParams.options ? (
        <div ref={chartRef} id={chartId} className={"w-full h-full"}></div>
      ) : (
        <div className={"w-full h-full"}>传入值不存在或异常,图表待解析</div>
      )}
    </>
  );
});
