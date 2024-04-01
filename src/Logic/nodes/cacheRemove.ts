import { signalLogicNode } from "../base.ts";
import { logic_Cache_clear } from "../../store/slice/nodeSlice.ts";
import cacheRemove from "../../assets/widgetIcon/cache-delete.svg";
import { of } from "rxjs";

export const buildCacheClearReqNode = () => {
  const cacheClearReq = signalLogicNode({
    id: logic_Cache_clear,
    type: "cache",
    src: cacheRemove,
    tips: "收到信号后立即清除所有缓存以便释放内存",
    name: "缓存清理器",
  });

  cacheClearReq.signalIn("in-0", (value) => {
    return of(value?.pre);
  });
};
