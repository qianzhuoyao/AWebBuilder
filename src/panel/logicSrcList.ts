import remoteGet from '../assets/widgetIcon/remote_get.svg'
import { logic_D_get, logic_U_get } from "../store/slice/nodeSlice";

export const LOGIC_SRC_ICON = {
  remote: [
    {
      id: logic_D_get,
      src: remoteGet,
      tips:'获取来自服务器上的数据',
      name: "获取器",
    },
    {
      id: logic_U_get,
      src: "",
      name: "同步器",
    },
  ],
};
