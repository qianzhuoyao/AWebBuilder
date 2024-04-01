import { signalLogicNode } from "../base.ts";
import { logic_or_BOTH_get } from "../../store/slice/nodeSlice.ts";
import orS from "../../assets/widgetIcon/mdi--math-norm.svg";
import { filter, of, tap } from "rxjs";
import { createSingleInstance } from "../../comp/createSingleInstance.ts";

const orTags = () => {
  const tagsIn1 = new Map<string, boolean>();
  const tagsIn2 = new Map<string, boolean>();
  return {
    tagsIn1,
    tagsIn2,
  };
};
export const getOrTags = createSingleInstance(orTags);
//检查器
export const or = () => {
  const Or = signalLogicNode<unknown, unknown, unknown>({
    id: logic_or_BOTH_get,
    type: "both",
    src: orS,
    tips: "当两端都存在信号且输入端某一端绿色时则发送其,并屏蔽另一段信号",
    name: "或门",
  });
  Or.signalIn("in-or-0", (value) => {
    getOrTags().tagsIn1.set(value.id, true);
    return of(1);
  });
  Or.signalIn("in-or-1", (value) => {
    getOrTags().tagsIn1.set(value.id, true);
    return of(1);
  });
  Or.signalOut("out-or", (value) => {
    return of(1).pipe(
      filter(() => {
        return !!(
          getOrTags().tagsIn2.get(value.id) || getOrTags().tagsIn1.get(value.id)
        );
      }),
      tap(() => {
        getOrTags().tagsIn1.set(value.id, false);
        getOrTags().tagsIn2.set(value.id, false);
      })
    );
  });
};
