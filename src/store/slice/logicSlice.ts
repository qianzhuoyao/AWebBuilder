import { createSlice } from '@reduxjs/toolkit';
import { getWDGraph } from '../../DirGraph/weightedDirectedGraph.ts';
import { INodeType } from './nodeSlice.ts';
import { ILogicTypeList } from '../../panel/logicSrcList.ts';


export type IProtocol = 'https' | 'http';

export interface IViewMapInfo {
  bindViewNodeId: string;
  type: 'IViewMapInfo',
}

export interface IRemoteReqInfo {
  type: 'IRemoteReqInfo',
  url: string;
  protocol: IProtocol;
  strict:boolean
  params: Record<string, string> | string; // kv or JSON
  desc?: string;
  method: 'post' | 'get';
}

export type IInfo = {
  remoteReqInfo?: IRemoteReqInfo
  viewMapInfo?: IViewMapInfo
}

export interface ILogicConfig {
  target: string[];

}

export interface ILogicNode {
  id: string;
  typeId: INodeType;
  config: ILogicConfig;
  belongClass: ILogicTypeList;
  shape: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
  //节点配置信息
  configInfo?: IInfo;
  /**
   * 对端句柄

   */
  ports: {
    type: 'in' | 'out',
    portName: string,
    tag: number,
    id: string,
    pointStatus: 0 | 1 | 2; // 0 无连接 1 信号存在时异常或者无信号 2 信号存在时正常
  }[];
}


export interface ILogicEdge {
  from: string;
  to: string;
  weight: number;
  fromPort: string;
  toPort: string;

}

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
  logicNodes: Record<string, ILogicNode>;
  logicEdges: ILogicEdge[];
  target: string[];
  signalSet: string[];
}

export const logicSlice = createSlice({
  name: 'logic',
  initialState: {
    target: [],
    logicEdges: [],
    logicNodes: {},
    signalSet: [],
    contentImageShowType: 0,
  } as ILs,
  reducers: {

    updateSignalSet: (state, action) => {
      state.signalSet = action.payload;
    },

    updateNodeConfigInfo: (state, action) => {
      const { id, configInfo, infoType } = action.payload;
      console.log(action.payload, 'e>)[id]');
      if (!infoType) {
        return;
      }
      ((state.logicNodes as Record<string, ILogicNode>)[id].configInfo as Record<string, any>)[infoType] = configInfo;
    },

    setLogicTarget: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.target = action.payload;
      }
    },


    addLogicEdge: (state, action) => {
      const { from, to, weight, fromPort, toPort } = action.payload;
      if (typeof from === 'string' && typeof to === 'string' && typeof weight === 'number') {
        const edge: ILogicEdge = {
          from,
          to,
          weight,
          fromPort,
          toPort,
        };
        state.logicEdges.push(edge);
        getWDGraph().addEdge(from, to, {}, weight, fromPort, toPort);
      } else {
        throw TypeError('type error');
      }
    },

    updateLogicPortsNode: (state, action) => {
      const { id, connected, tag, portType } = action.payload;
      console.log(tag, state, action.payload, 'tagtagtagtag');
      (state.logicNodes as Record<string, ILogicNode>)[id] =
        {
          ...(state.logicNodes as Record<string, ILogicNode>)[id]
          , ...{
            ...action.payload, ports: (state.logicNodes as Record<string, ILogicNode>)[id].ports.map(port => {
              if ((port.type + port.tag + '#' + port.id) === tag && port.type === portType) {
                return {
                  ...port,
                  pointStatus: connected,
                };
              } else {
                return port;
              }
            }),
          },
        };

    },

    updateLogicNode: (state, action) => {
      const { id } = action.payload;
      (state.logicNodes as Record<string, ILogicNode>)[id] =
        { ...(state.logicNodes as Record<string, ILogicNode>)[id], ...action.payload };

    },


    deleteNode: (state, action) => {
      const newKeys = Object.keys(state.logicNodes).filter(key => key !== action.payload.id);
      const newObj: Record<string, ILogicNode> = {};
      newKeys.map(key => {
        newObj[key] = (state.logicNodes as Record<string, ILogicNode>)[key];
      });
      state.logicNodes = newObj;
      //同步至边

    },
    addLogicNode: (state, action) => {

      (state.logicNodes as Record<string, ILogicNode>)[action.payload.id] =
        action.payload;
      //添加节点，与logicNodes 区分开是为了做redo undo
      getWDGraph().addVertex(action.payload.id);
    },
    updateLogicContentImageShowType: (state, action) => {
      state.contentImageShowType = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const {
  updateLogicPortsNode,
  updateLogicNode,
  addLogicEdge,
  deleteNode,
  updateSignalSet,
  setLogicTarget,
  updateNodeConfigInfo,
  updateLogicContentImageShowType,
  addLogicNode,
} = logicSlice.actions;

export default logicSlice.reducer;
