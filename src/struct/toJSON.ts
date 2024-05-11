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
import {
  DEMO_CAROUSEL_LOCALSTORAGE_CAROUSEL,
  DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW,
  DEMO_LOCALSTORAGE,
  SERVICE_PORT,
} from "../contant";
import { IPs } from "../store/slice/panelSlice.ts";
import { INs, IViewNode } from "../store/slice/nodeSlice.ts";
import { ILogicNode } from "../store/slice/logicSlice.ts";
import { viewNodesToJSON } from "../node/viewConfigSubscribe.ts";
import { toImage } from "../comp/domToImage.ts";

export interface IParseInPanel {
  webLogic: string;
  webNodes: string;
  viewName: string;
  webPanel: string;
  img?: string;
  viewId: string;
}

/**
 * window.location.protocol +
  "//" +
  window.location.hostname +
  ":" +
  SERVICE_PORT

  'http://localhost:8000'
 */
const targetHost = window.location.protocol +
"//" +
window.location.hostname +
":" +
SERVICE_PORT

/**
 * 当前作为内嵌iframe时，发送保存消息
 * @param PanelState
 * @param NodesState
 */
export const toSaveJSON = (image: string, PanelState: IPs, NodesState: INs, id: string) => {
  console.log(id, "image");
  window.parent.postMessage(
    {
      type: "save",
      name: PanelState.workSpaceName,
      panel: JSON.stringify(PanelState),
      shotImage: image,
      id: id,
      logic: {
        C: genLogicConfigMapToJSON(),
        G: getWDGraph().toJSON(),
        N: logicNodesConfigToJSON(),
        L: getLayerContentToJSON(),
      },
      nodeConfig: viewNodesToJSON(),
      nodes: JSON.stringify(NodesState),
    },
    targetHost
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
  genLogicConfigMapToParse(parseJsonData?.C || "{}");
  Object.values(parseJsonView?.list || {})?.map((item) => {
    panelViewPaint.paintViewNodesEach(item as IViewNode);
  });
  console.log(JSON.parse(parseJsonData?.N || "{}"), 'iuskjrrrr')
  Object.values(JSON.parse(parseJsonData?.N || "{}"))?.map((node) => {
    panelViewPaint.paintLogicNodesEach(node as ILogicNode);
  });
  genWDGraph(parseJsonData?.G || "{}");
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
    targetHost
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
    targetHost
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
    targetHost
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
    console.log(e, 'dedededededd')
    if (
      e.origin ===
      targetHost
    ) {
      callback(e.data?.data);
    }
  };
  window.addEventListener("message", subscription, false);
  return subscription;
};

const typeCheck = (value: string): object => {
  const obj = JSON.parse(value)
  if (obj instanceof Object) {
    return obj
  }
  return {}
}

export const toSetLocalstorage = (
  workSpace: string,
  state: typeof DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW | typeof DEMO_CAROUSEL_LOCALSTORAGE_CAROUSEL,
  webNodesJSON: string,
  webPanelJSON: string,
  webLogicJSON: string
) => {
  const LOGIC = JSON.parse(webLogicJSON || '{}');
  const PANEL = JSON.parse(webPanelJSON || '{}')
  const NODE = JSON.parse(webNodesJSON || '{}')


  const pre_obj = window.localStorage.getItem(DEMO_LOCALSTORAGE) || "{}"

  const DEMO_LOCALSTORAGE_OBJ = {
    ...typeCheck(pre_obj),
    [workSpace]: {
      PANEL,
      NODE,
      LOGIC,
      DEMO_STATUS_LOCALSTORAGE: state
    }
  }
  console.log(DEMO_LOCALSTORAGE_OBJ, pre_obj, 'DEMO_LOCALSTORAGE_OBJ')
  window.localStorage.setItem(DEMO_LOCALSTORAGE, JSON.stringify(DEMO_LOCALSTORAGE_OBJ))
  // window.localStorage.setItem(DEMO_NODE_LOCALSTORAGE, webNodesJSON || "{}");
  // window.localStorage.setItem(
  //   DEMO_STATUS_LOCALSTORAGE,
  //   DEMO_CAROUSEL_LOCALSTORAGE_PREVIEW
  // );
  //window.localStorage.setItem(DEMO_PANEL_LOCALSTORAGE, webPanelJSON || "{}");
  // window.localStorage.setItem(
  //   DEMO_LOGIC_LOCALSTORAGE,
  //   JSON.stringify({
  //     C: LOGIC?.C || "{}",
  //     G: LOGIC?.G || "{}",
  //     N: LOGIC?.N || "{}",
  //   })
  // );
};
