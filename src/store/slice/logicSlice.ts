import { createSlice } from "@reduxjs/toolkit";
import { getWDGraph } from "../../DirGraph/weightedDirectedGraph.ts";
import { INodeType } from "./nodeSlice.ts";
import { ILogicTypeList } from "../../panel/logicSrcList.ts";

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
type logicId = string;

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
  logicNodes: Record<string, ILogicNode>;
  logicEdges: ILogicEdge[];
  target: string[];
  signalSet: { source: string; target: string }[];
  //正在执行任务的fromId集合
  workingNodeIdList: string[];
  //某发送节点的发送次数
  sendDugCount: Record<
    string,
    Record<
      logicId,
      {
        type: "success" | "fail" | "pending";
        startTime: number;
        endTime: number;
      }
    >
  >;
  logicPanel: {
    //如果存在循环任务时切断逻辑链路如果时true则停止链路逻辑，否则持续执行
    autoStop: boolean;
  };
}

export const logicSlice = createSlice({
  name: "logic",
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

    setLogicTarget: (state, action) => {
      if (Array.isArray(action.payload)) {
        state.target = action.payload;
      }
    },

    updateLogicNode: (state, action) => {
      const { id } = action.payload;
      (state.logicNodes as Record<string, ILogicNode>)[id] = {
        ...(state.logicNodes as Record<string, ILogicNode>)[id],
        ...action.payload,
      };
    },

    deleteLogicNode: (state, action) => {
      const newKeys = Object.keys(state.logicNodes).filter(
        (key) => key !== action.payload.id
      );
      const newObj: Record<string, ILogicNode> = {};
      newKeys.map((key) => {
        newObj[key] = (state.logicNodes as Record<string, ILogicNode>)[key];
      });
      state.logicNodes = newObj;
    },
    addLogicNode: (state, action) => {
      (state.logicNodes as Record<string, ILogicNode>)[action.payload.id] =
        action.payload;
      //添加节点，与logicNodes 区分开是为了做redo undo
      getWDGraph().addVertex(action.payload.id);
    },
  },
});
// 
export const {
  updateLogicNode,
  deleteLogicNode,
  updateSendDugCount,
  clearSendDugCount,
  setLogicTarget,
  deleteSendDugCount,
  addLogicNode,
} = logicSlice.actions;

export default logicSlice.reducer;
