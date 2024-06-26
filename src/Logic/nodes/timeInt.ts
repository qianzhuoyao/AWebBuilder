import { signalLogicNode } from "../base.ts";
import { logic_Ring_get } from "../../store/slice/nodeSlice.ts";
import ring from "../../assets/widgetIcon/icon-park--cross-ring-two.svg";
import { of, interval, takeWhile, defer, tap } from "rxjs";
import { MUST_FORCE_STOP_SE } from "../../contant";
import { createSingleInstance } from "../../comp/createSingleInstance.ts";
import { getSyncTimeIntConfig } from "../../Setting/form/logic/timer/timeConfig.tsx";
import { ITimerConfigInfo } from "./logicConfigMap.ts";

const intTimer = () => {
  const timer = new Map<string, boolean>();
  return {
    timer,
  };
};

export const getInitTimer = createSingleInstance(intTimer);
//循环器
export const timeInter = () => {
  const TimeInter = signalLogicNode<
    { timerConfigInfo: ITimerConfigInfo },
    unknown,
    unknown
  >({
    id: logic_Ring_get,
    type: "timeInter",
    src: ring,
    tips: "收到信号后循环发出信号,直到stop端口收到信号止",
    name: "循环",
  });

  TimeInter.signalIn("in-go", (value) => {
    getInitTimer().timer.set(value.id, true);
    getSyncTimeIntConfig().subject.next({
      status: true,
    });
    return of(value?.pre);
  });

  TimeInter.signalIn("in-stop", (value) => {
    return defer(() => of(MUST_FORCE_STOP_SE)).pipe(
      tap(() => {
        getInitTimer().timer.set(value.id, false);

        getSyncTimeIntConfig().subject.next({
          status: false,
        });
      })
    );
  });

  TimeInter.signalOut("out", (value) => {
    return interval(value.config.timerConfigInfo.time || 1000).pipe(
      takeWhile(() => {
        return (
          !!getInitTimer().timer.get(value.id) &&
          value?.pre !== MUST_FORCE_STOP_SE
        );
      })
    );
  });
};
