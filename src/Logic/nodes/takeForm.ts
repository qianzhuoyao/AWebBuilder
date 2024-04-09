import { signalLogicNode } from "../base.ts";
import { logic_Form_get } from "../../store/slice/nodeSlice.ts";
import formV from "../../assets/widgetIcon/mdi--form.svg";
import { of } from "rxjs";
import { IFormConfigInfo } from "./logicConfigMap.ts";

//检查器
export const takeForm = <T>() => {
  const TakeForm = signalLogicNode<
    { formConfigInfo: IFormConfigInfo<T> },
    unknown,
    unknown
  >({
    id: logic_Form_get,
    type: "mix",
    src: formV,
    tips: "表单构建,输出结构json并流出",
    name: "构造器",
  });
  TakeForm.signalIn("in-0", (value) => {
    return of(value?.pre);
  });

  TakeForm.signalOut<T>("out-form", (value) => {
  
    const result = value?.config?.formConfigInfo?.mergePre
      ? Object.assign({}, value?.pre, value?.config?.formConfigInfo?.json)
      : value?.config?.formConfigInfo?.json;
      console.log(result,'dwdwwddww')
    //覆盖
    return of(result)
  });
};
