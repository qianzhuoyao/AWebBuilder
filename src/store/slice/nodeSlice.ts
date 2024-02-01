import { createSlice } from "@reduxjs/toolkit";
import * as Echart from "echarts";
import { enableMapSet } from "immer";

//pixTable
export const pix_Table = "pixTable" as const;
//文本
export const pix_Text = "pixText" as const;
//图片资源
export const pic_Img = "pic" as const;
//条形图
export const pix_Line = "pixLine" as const;
//面积图
export const pix_GLine = "pixGLine" as const;
//普通柱状图
export const pix_BX = "pixBX" as const;
//横向柱状图
export const pix_BY = "pixBY" as const;
//折现柱状图
export const pix_BLine = "pixBLine" as const;

//关于信号的说明，0/1 当存在型号时，信号边为1 否则为0
//逻辑 数据获取器
export const logic_D_get = "logic_D_get" as const;
//逻辑 提交数据
export const logic_U_get = "logic_U_get" as const;
//缓存器
export const logic_Cache_set = "logic_Cache_set" as const;
//清理所有缓存
export const logic_Cache_clear = "logic_Cache_clear" as const;
//校验器 当信号输入值与设置值相等时通过，否则拦截
export const logic_P_get = "logic_P_set" as const;
//信号转换器，输入的信号不满足条件时 不丢弃 并继续发送一条 信息用以通知
export const logic_TM_get = "logic_TM_get" as const;
export type INodeType =
  | typeof pix_BLine
  | typeof logic_TM_get
  | typeof pix_Table
  | typeof pix_BY
  | typeof pix_BX
  | typeof pix_GLine
  | typeof pix_Line
  | typeof pic_Img
  | typeof pix_Text
  | typeof logic_Cache_clear
  | typeof logic_D_get
  | typeof logic_U_get
  | typeof logic_Cache_set
  | typeof logic_P_get;

interface IChartInstance {
  option?: Echart.EChartsOption;
  type:
    | typeof pix_BLine
    | typeof pix_GLine
    | typeof pix_BY
    | typeof pix_BX
    | typeof pix_Line;
}

export type IIstance = IChartInstance;

enableMapSet();

export type IClassify =
  | "chart"
  | "table"
  | "dom"
  | "text"
  | "line"
  | "remote"
  | "cache";

export interface IViewNode {
  //标识
  id: string;
  //基于面板的横坐标
  x: number;
  //基于面板的纵坐标
  y: number;
  //基于面板的长度
  w: number;
  //基于面板的高度
  h: number;
  //基于面板的层级
  z: number;
  //基于面板的旋转度
  r: number;
  //别名
  alias: string;
  //说明
  desc: string;
  //拷贝自
  copyBy?: string;
  //分类
  classify: IClassify;
  //实例容器
  instance: IIstance;
  nodeType: "VIEW" | "LOGIC";
}

type nodeId = string;
export interface INs {
  targets: string[];
  list: Record<nodeId, IViewNode>;
}

export const viewNodesSlice = createSlice({
  name: "nodes",
  initialState: {
    list: {},
    targets: [],
  },
  reducers: {
    deleteListItem: (state, action) => {
      const { idList } = action.payload;
      if (Array.isArray(idList)) {
        const newList: Record<nodeId, IViewNode> = {};
        Object.keys(state.list).map((key) => {
          if (!idList.includes(key)) {
            newList[key] = (state.list as Record<string, IViewNode>)[key];
          }
        });
        state.list = newList;
      }
    },

    updateTargets: (state, action) => {
      state.targets = action.payload;
    },
    updateSize: (state, action) => {
      const findNode = (state.list as Record<string, IViewNode>)[
        action.payload.id || ""
      ];
      if (findNode) {
        const newNode = {
          ...findNode,
          w: action.payload.w,
          h: action.payload.h,
        };
        state.list = { ...state.list, [action.payload.id]: newNode };
      }
    },
    updatePosition: (state, action) => {
      const findNode = (state.list as Record<string, IViewNode>)[
        action.payload.id || ""
      ];
      if (findNode) {
        const newNode = {
          ...findNode,
          x: action.payload.x,
          y: action.payload.y,
        };
        state.list = { ...state.list, [action.payload.id]: newNode };
      }
    },
    addNode: (state, action) => {
      (state.list as Record<string, IViewNode>)[action.payload.id] =
        action.payload;
    },
  },
});

export const {
  addNode,
  updateTargets,
  updatePosition,
  deleteListItem,
  updateSize,
} = viewNodesSlice.actions;

export default viewNodesSlice.reducer;
