import { signalLogicNode } from "../base.ts";
import { logic_Day_shift_Trigger } from "../../store/slice/nodeSlice.ts";
import dayIcon from "../../assets/widgetIcon/fluent--shifts-day-20-filled (1).svg";
import { of } from "rxjs";
import dayjs from "dayjs";

//检查器
export const handleGetDate = () => {
    const GetDate = signalLogicNode({
        id: logic_Day_shift_Trigger,
        type: "date",
        src: dayIcon,
        pickSrc: dayIcon,
        tips: "获取当前时间",
        name: "时间获取器",
    });

    GetDate.signalIn("in", (value) => {
        return of(value?.pre);
    });
    GetDate.signalOut("out", () => {
        return of({
            dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    });
};
