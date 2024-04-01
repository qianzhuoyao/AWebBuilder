import { signalLogicNode } from "../base.ts";
import { logic_MixData_get } from "../../store/slice/nodeSlice.ts";
import mix from "../../assets/widgetIcon/mdi--instant-mix.svg";

//检查器
export const mapFieldMixData = () => {
  signalLogicNode({
    id: logic_MixData_get,
    type: "mix",
    src: mix,
    tips: "对传入的信号进行映射字段,并输出映射完毕的字段值",
    name: "映射器",
  });
};
