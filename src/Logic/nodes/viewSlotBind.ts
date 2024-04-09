import { signalLogicNode } from "../base.ts";
import { IViewNode, logic_View_bind } from "../../store/slice/nodeSlice.ts";
import mapSrc from "../../assets/widgetIcon/oi--project.svg";
import { of, tap } from "rxjs";
import { inertViewCache } from "../../panel/data.ts";
import { IViewMapInfo } from "./logicConfigMap.ts";
import { IObjectNotNull } from "../../comp/filterObjValue.ts";
import { ITableConfig, insertConfig } from "../../node/viewConfigSubscribe.ts";

//检查器
export const viewLogicSlot = <T>() => {
  const ViewLogicSlot = signalLogicNode<
    { viewMapInfo: IViewMapInfo<T & IViewNode> },
    unknown,
    unknown
  >({
    id: logic_View_bind,
    type: "viewSlot",
    src: mapSrc,
    tips: "将组件映射至逻辑层,与事件同与门时,触发事件",
    name: "绑定器",
  });
  ViewLogicSlot.signalIn("in-0", (value) => {
    //输入 =》数据绑定

    //
    return of(value.pre);
  });

  ViewLogicSlot.signalOut<unknown>("out", (value) => {
    console.log(value, 'ViewLogicSlost')
    //输出=》事件输出
    return of(value.pre).pipe(
      tap(() => {
        console.log(value, 'ViewLogicSlot')
        insertConfig(value?.config?.viewMapInfo?.viewNodeId, value.config.viewMapInfo.data.instance.option as ITableConfig);
        inertViewCache(
          value?.config?.viewMapInfo?.viewNodeId,
          value?.pre as IObjectNotNull<unknown>
        );
      })
    )
  });
};
