import { signalLogicNode } from "../base.ts";
import { logic_TM_get } from "../../store/slice/nodeSlice.ts";
import change from "../../assets/widgetIcon/filter-change.svg";

//逆变器
export const changeSignal = () => {
  signalLogicNode({
    id: logic_TM_get,
    type: "filter",
    src: change,
    tips: "校验信号数据并将其限制,满足条件即放行否则转换为一条新的信号并下发",
    name: "逆变器",
  });
};
