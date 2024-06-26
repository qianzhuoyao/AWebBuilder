import { signalLogicNode } from "../base.ts";
import { logic_Dug_Trigger } from "../../store/slice/nodeSlice.ts";
import trigger from "../../assets/widgetIcon/game-icons--click.svg";
import triggerPick from "../../assets/widgetIcon/game-icons--click2.svg";
import { emitLogic } from "./emit.ts";
import { takeWhile } from "rxjs";
import { CONSTANT_DEMO_PATH } from "../../contant";

//检查器
export const handleTrigger = () => {
  const HandleTrigger = signalLogicNode({
    id: logic_Dug_Trigger,
    type: "hTrigger",
    src: trigger,
    pickSrc: triggerPick,
    tips: "手动发送一个1信号",
    name: "触发器",
  });

  HandleTrigger.signalOut("out", () => {
    return emitLogic().pipe(
      takeWhile(() => {
        return window.location.pathname.slice(0, 6) !== CONSTANT_DEMO_PATH;
      })
    );
  });
};
