import remoteGet from "../assets/widgetIcon/remote_get.svg";
import remoteSync from "../assets/widgetIcon/remote-sync.svg";
import cacheSet from "../assets/widgetIcon/cache-storage.svg";
import {
  logic_D_get,
  logic_U_get,
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
  ],
};
