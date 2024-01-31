import { memo, useEffect, useId, useRef } from "react";
import * as Echart from "echarts";
import { INodeType } from "../store/slice/nodeSlice";

const barDefaultOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
};

interface IBaseChart {
  options?: Echart.EChartsOption;
  width: number;
  height: number;
  type: INodeType;
}

export const BaseChart = memo((chartParams: IBaseChart) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartId = useId();
  console.log(chartParams, "chartParams");
  useEffect(() => {
    //销毁指向
    const CRvar = chartRef.current;

    if (CRvar) {
      const ChartInstance = Echart.init(CRvar);

      if (chartParams.options) {
        ChartInstance.setOption(chartParams.options);
      } else {
        if (chartParams.type === "pixBX") {
          ChartInstance.setOption(barDefaultOption);
        }
      }
      const R = new ResizeObserver(() => {
        ChartInstance.resize();
      });
      R.observe(CRvar);

      return () => {
        ChartInstance.dispose()
        CRvar && R.unobserve(CRvar);
        R.disconnect();
      };
    }
  }, [chartParams.options, chartParams.type]);

  return (
    <div
      ref={chartRef}
      id={chartId}
      style={{
        width: chartParams.width + "px",
        height: chartParams.height + "px",
      }}
      //   className={`w-[${chartParams.width}px] h-[${chartParams.height}px]`}
    ></div>
  );
});
