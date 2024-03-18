import { createSlice } from '@reduxjs/toolkit';
import { getWDGraph } from '../../DirGraph/weightedDirectedGraph.ts';
import { INodeType } from './nodeSlice.ts';
import { ILogicTypeList } from '../../panel/logicSrcList.ts';

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
  portType: string;
  width: number;
  height: number;
  imageUrl: string;
}


export interface ILogicEdge {
  from: string;
  to: string;
  weight: number;
  fromPort: string;
  toPort: string;

}

//逻辑路基id而不是节点
type logicId = string

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
  logicNodes: Record<string, ILogicNode>;
  logicEdges: ILogicEdge[];
  target: string[];
  signalSet: { source: string, target: string }[];
  //正在执行任务的fromId集合
  workingNodeIdList: string[],
  //某发送节点的发送次数
  sendDugCount: Record<string, Record<logicId, {
    type: 'success' | 'fail' | 'pending'
    startTime: number,
    endTime: number
  }>>;
  logicPanel: {
    //如果存在循环任务时切断逻辑链路如果时true则停止链路逻辑，否则持续执行
    autoStop: boolean
  };
}

export const logicSlice = createSlice({
  name: 'logic',
  initialState: {
    sendDugCount: {},
    workingNodeIdList: [],
    logicPanel: {
      autoStop: false,
    },
    target: [],
    logicEdges: [],
    logicNodes: {},
    signalSet: [],
    contentImageShowType: 0,
    stagPool: [],
  } as ILs,
  reducers: {
    updateSendDugCount: (state, action) => {
      const { nodeId, id, type, startTime, endTime } = action.payload;
      if (!state.sendDugCount[nodeId]) {
        state.sendDugCount[nodeId] = {};
      }
      state.sendDugCount[nodeId][id] = {
        ...state.sendDugCount[nodeId][id],
        type,
        startTime,
        endTime,
      };
    },
    clearSendDugCount: (state, action) => {
      const { nodeId } = action.payload;
      if (!state.sendDugCount[nodeId]) {
        state.sendDugCount[nodeId] = {};
      }
      state.sendDugCount[nodeId] = {};
    },
    deleteSendDugCount: (state, action) => {
      const { nodeId, id } = action.payload;
      delete state.sendDugCount[nodeId][id];
    },
    deleteWorkingNodeIdList: (state, action) => {
      const { id } = action.payload;
      state.workingNodeIdList = state.workingNodeIdList.filter(i => i !== id);
    },
    updateWorkingNodeIdList: (state, action) => {
      const { id } = action.payload;
      if (!state.workingNodeIdList.includes(id)) {
        state.workingNodeIdList = state.workingNodeIdList.concat([id]);
      }
    },


    removeLogicEdge: (state, action) => {
      const { from, fromPort, to, toPort } = action.payload;
      state.logicEdges = state.logicEdges.filter(edge => {
          return !(
            edge.from === from &&
            edge.fromPort === fromPort &&
            edge.to === to &&
            edge.toPort === toPort
          );
        },
      );
    },

    clearSignalSet: (state) => {
      state.signalSet = []
    },

    updateSignalSet: (state, action) => {
      state.signalSet = state.signalSet.concat(action.payload);
    },


    setLogicTarget: (state, action) => {
      console.log(action.payload, 'sssaction.payload');
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
      const { id, portId, connected, portType } = action.payload;
      console.log(JSON.parse(JSON.stringify(state)), action.payload, 'tagtagtagtag');
      (state.logicNodes as Record<string, ILogicNode>)[id] =
        {
          ...(state.logicNodes as Record<string, ILogicNode>)[id]
          , ...{
            ...action.payload, ports: (state.logicNodes as Record<string, ILogicNode>)[id]?.ports.map(port => {
              if (portType === 'in') {
                if (port.id === portId.split('#')[1] && port.type === portType) {
                  return {
                    ...port,
                    pointStatus: connected,
                  };
                } else {
                  return port;
                }
              } else {
                if (port.type === portType) {
                  return {
                    ...port,
                    pointStatus: connected,
                  };
                } else {
                  return port;
                }
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
  clearSignalSet,
  removeLogicEdge,
  updateLogicPortsNode,
  updateLogicNode,
  addLogicEdge,
  deleteNode,
  updateSendDugCount,
  clearSendDugCount,
  updateSignalSet,
  updateWorkingNodeIdList,
  deleteWorkingNodeIdList,
  setLogicTarget,
  updateLogicContentImageShowType,
  deleteSendDugCount,
  addLogicNode,
} = logicSlice.actions;

export default logicSlice.reducer;
