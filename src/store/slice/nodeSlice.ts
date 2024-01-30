import { createSlice } from "@reduxjs/toolkit";

import { enableMapSet } from "immer";
enableMapSet();
export interface IViewNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

export interface INs {
  //undefined 表示暂未操作，动画不开启
  list: Record<string, IViewNode>;
}

export const viewNodesSlice = createSlice({
  name: "nodes",
  initialState: {
    list: {},
  },
  reducers: {
    updatePosition: (state, action) => {
      const findNode = (state.list as Record<string, IViewNode>)[
        action.payload.id || ""
      ];
      if (findNode) {
        const newNode = {
          ...findNode,
          ...action.payload,
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
// 每个 case reducer 函数会生成对应的 Action creators
export const { addNode, updatePosition } = viewNodesSlice.actions;

export default viewNodesSlice.reducer;
