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

export type INodeType =
  | typeof pix_BLine
  | typeof pix_Table
  | typeof pix_BY
  | typeof pix_BX
  | typeof pix_GLine
  | typeof pix_Line
  | typeof pic_Img
  | typeof pix_Text;

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

export type IClassify = "chart" | "table" | "dom" | "text" | "line";

export interface IViewNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  classify: IClassify;
  instance: IIstance;
}

type nodeId = string;
export interface INs {
  list: Record<nodeId, IViewNode>;
}

export const viewNodesSlice = createSlice({
  name: "nodes",
  initialState: {
    list: {},
  },
  reducers: {
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

export const { addNode, updatePosition, updateSize } = viewNodesSlice.actions;

export default viewNodesSlice.reducer;