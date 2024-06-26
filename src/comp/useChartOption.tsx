import { getWCache } from "../panel/data";
import * as echarts from "echarts"
import "echarts-gl"

export const runChartOption = (nodeId: string, body: string) => {
  return new Function(
    "params",
    "echarts",
    `try{
  ${body || "return {}"}
  }catch(e){return {}}`
  )(getWCache(nodeId), echarts);
};
