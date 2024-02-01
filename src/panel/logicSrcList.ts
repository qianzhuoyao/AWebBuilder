import remoteGet from "../assets/widgetIcon/remote_get.svg";
import remoteSync from "../assets/widgetIcon/remote-sync.svg";
import cacheSet from "../assets/widgetIcon/cache-storage.svg";
import checkPass from "../assets/widgetIcon/check-pass.svg";
import cacheRemove from "../assets/widgetIcon/cache-delete.svg";
import change from "../assets/widgetIcon/filter-change.svg";
import {
  logic_D_get,
  logic_U_get,
  logic_P_get,
  logic_TM_get,
  logic_Cache_clear,
  logic_Cache_set,
} from "../store/slice/nodeSlice";

//标准颜色#52525b
export const LOGIC_SRC_ICON = {
  remote: [
    {
      id: logic_D_get,
      src: remoteGet,
      tips: "获取来自服务器上的数据",
      name: "获取器",
    },
    {
      id: logic_U_get,
      src: remoteSync,
      tips: "发送一个请求到后端",
      name: "同步器",
    },
  ],
  cache: [
    {
      id: logic_Cache_set,
      src: cacheSet,
      tips: "获取来自服务器上的数据",
      name: "缓存设置器",
    },
    {
      id: logic_Cache_clear,
      src: cacheRemove,
      tips: "清除所有缓存以便释放内存",
      name: "缓存清理器",
    },
  ],
  filter: [
    {
      id: logic_P_get,
      src: checkPass,
      tips: "校验信号数据并将其限制,满足条件即放行否则拦截并丢弃",
      name: "检查器",
    },
    {
      id: logic_TM_get,
      src: change,
      tips: "校验信号数据并将其限制,满足条件即放行否则转换为一条新的信号并下发",
      name: "逆变器",
    },
  ],
};
