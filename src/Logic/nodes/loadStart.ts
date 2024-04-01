import { signalLogicNode } from "../base.ts";
import { logic_Load_start } from "../../store/slice/nodeSlice.ts";
import start from "../../assets/widgetIcon/lucide--between-horizontal-start.svg";
import { of, takeWhile } from "rxjs";
import { CONSTANT_DEMO_PATH } from "../../contant";
import dayjs from "dayjs";

export const loadStart = () => {
  const LoadStart = signalLogicNode({
    id: logic_Load_start,
    type: "page",
    src: start,
    tips: "当window.load完成后自动发出信号1",
    name: "初始",
  });

  LoadStart.signalOut("page-load", () => {
    return of({
      currentDate: dayjs(),
      type: "page-load",
    }).pipe(
      takeWhile(() => {
        console.log("f--------------");
        return window.location.pathname.slice(0, 6) === CONSTANT_DEMO_PATH;
      })
    );
  });
};
