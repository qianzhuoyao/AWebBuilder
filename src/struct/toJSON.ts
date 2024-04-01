import {
  genLogicConfigMapToJSON,
  genLogicConfigMapToParse,
} from "../Logic/nodes/logicConfigMap.ts";
import { genWDGraph, getWDGraph } from "../DirGraph/weightedDirectedGraph.ts";
import { logicNodesConfigToJSON } from "../panel/logicPanelEventSubscribe.ts";
import {
  getLayerContentToJSON,
  getLayerContentToParse,
} from "../panel/layers.ts";
import { SERVICE_PORT } from "../contant";
import { IPs } from "../store/slice/panelSlice.ts";
import { INs, IViewNode } from "../store/slice/nodeSlice.ts";
import { ILogicNode } from "../store/slice/logicSlice.ts";
import { viewNodesToJSON } from "../node/viewConfigSubscribe.ts";

export interface IParseInPanel {
  webLogic: string;
  webNodes: string;
  viewName: string;
  webPanel: string;
  img?: string;
}

/**
 * 当前作为内嵌iframe时，发送保存消息
 * @param PanelState
 * @param NodesState
 */
export const toSaveJSON = (PanelState: IPs, NodesState: INs) => {
  window.parent.postMessage(
    {
      type: "save",
      name: PanelState.workSpaceName,
      panel: JSON.stringify(PanelState),
      logic: {
        C: genLogicConfigMapToJSON(),
        G: getWDGraph().toJSON(),
        N: logicNodesConfigToJSON(),
        L: getLayerContentToJSON(),
      },
      nodeConfig: viewNodesToJSON(),
      nodes: JSON.stringify(NodesState),
    },
    window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      SERVICE_PORT
  );
};

/**
 * 当前作为内嵌iframe时，接收到信息并解析至panel
 * @param data
 * @param panelViewPaint
 */
export const toParseInPanel = (
  data: IParseInPanel,
  panelViewPaint: {
    paintViewNodesEach: (node: IViewNode) => void;
    paintLogicNodesEach: (logicNode: ILogicNode) => void;
  }
) => {
  const parseJsonData = JSON.parse(data.webLogic || "{}");
  const parseJsonView = JSON.parse(data.webNodes || "{}");
  getLayerContentToParse(parseJsonData?.L || "{}");
  genLogicConfigMapToParse(parseJsonData?.C);
  Object.values(parseJsonView?.list || {})?.map((item) => {
    panelViewPaint.paintViewNodesEach(item as IViewNode);
  });
  Object.values(JSON.parse(parseJsonData?.N || "{}"))?.map((node) => {
    panelViewPaint.paintLogicNodesEach(node as ILogicNode);
  });
  genWDGraph(parseJsonData?.G || "");
};

/**
 * 当前作为内嵌iframe时，发送删除消息
 * @param data
 */
export const frameSendDelete = <T>(data: T) => {
  window.parent.postMessage(
    {
      node: data,
      type: "delete",
    },
    window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      SERVICE_PORT
  );
};
/**
 * 当前作为内嵌iframe时，发送页面加载完成消息
 */
export const frameSendPageLoadSuccess = () => {
  window.parent.postMessage(
    {
      type: "loadSuccess",
    },
    window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      SERVICE_PORT
  );
};

/**
 * 当前作为内嵌iframe时，发送分页消息
 * @param pageNum
 */
export const frameSendChangePageInfo = (pageNum: number) => {
  window.parent.postMessage(
    {
      pageNum: pageNum,
      type: "changePage",
    },
    window.location.protocol +
      "//" +
      window.location.hostname +
      ":" +
      SERVICE_PORT
  );
};
/**
 * 父页面必须端口为SERVICE_PORT 并且不能存在跨域
 * 当前作为内嵌iframe时，监听外部消息并渲染列表信息
 * 数据必须包含{
 *   total:number
 *   records:{
 *   webLogic: string;
 *   webNodes: string;
 *   viewName: string;
 *   webPanel: string;
 *   img?: string;
 *   }[]
 * }
 * @param callback
 */
export const messageEventListener = <T>(callback: (params: T) => void) => {
  const subscription = (
    e: MessageEvent<{
      data: T;
    }>
  ) => {
    if (
      e.origin ===
      window.location.protocol +
        "//" +
        window.location.hostname +
        ":" +
        SERVICE_PORT
    ) {
      callback(e.data?.data);
    }
  };
  window.addEventListener("message", subscription, false);
  return subscription;
};

export const toSetLocalstorage = (
  webNodesJSON: string,
  webPanelJSON: string,
  webLogicJSON: string
) => {
  const LOGIC = JSON.parse(webLogicJSON);
  window.localStorage.setItem("DEMO-NODE#", webNodesJSON || "{}");
  window.localStorage.setItem("DEMO-PANEL#", webPanelJSON || "{}");
  window.localStorage.setItem(
    "DEMO-LOGIC#",
    JSON.stringify({
      C: LOGIC?.C || "{}",
      G: LOGIC?.G || "{}",
      N: LOGIC?.N || "{}",
    })
  );
};
