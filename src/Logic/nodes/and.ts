import { signalLogicNode } from "../base.ts";
import { logic_and_BOTH_get } from "../../store/slice/nodeSlice.ts";
import andS from "../../assets/widgetIcon/mingcute--and-line.svg";
import { of, filter, tap } from "rxjs";
import { createSingleInstance } from "../../comp/createSingleInstance.ts";

const andTags = () => {
  const tagsIn1 = new Map<string, boolean>();
  const tagsIn2 = new Map<string, boolean>();
  return {
    tagsIn1,
    tagsIn2,
  };
};

export const getAndTags = createSingleInstance(andTags);

//检查器
export const and = () => {
  const And = signalLogicNode<unknown, unknown, unknown>({
    id: logic_and_BOTH_get,
    type: "both",
    src: andS,
    tips: "当两输入端都存在信号且为绿色时合并两个信号值为一个数组并下发",
    name: "与门",
  });

  And.signalIn("in-and-0", (value) => {
    return of(value.pre).pipe(
      tap(() => {
        getAndTags().tagsIn1.set(value.id, true);
        console.log(getAndTags(), value, "getAndTags()=0");
      })
    );
  });

  And.signalIn("in-and-1", (value) => {
    return of(value.pre).pipe(
      tap(() => {
        getAndTags().tagsIn2.set(value.id, true);
        console.log(getAndTags(), value, "getAndTags()=1");
      })
    );
  });

  And.signalOut("out-and", (value) => {
    console.log(getAndTags(), "getAndTags()");
    return of(value.pre).pipe(
      filter(() => {
        return (
          (getAndTags().tagsIn2.get(value.id) &&
            getAndTags().tagsIn1.get(value.id)) ||
          false
        );
      }),
      tap(() => {
        getAndTags().tagsIn1.set(value.id, false);
        getAndTags().tagsIn2.set(value.id, false);
      })
    );
  });
};
