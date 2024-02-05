import { createSlice } from "@reduxjs/toolkit";

export interface ILogicNode {
  id: string;
  shape: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl: string;
}

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
  logicNodes: Record<string, ILogicNode>;
}

export const logicSlice = createSlice({
  name: "logic",
  initialState: {
    logicNodes: {},
    contentImageShowType: 0,
  },
  reducers: {
    addLogicNode: (state, action) => {
      (state.logicNodes as Record<string, ILogicNode>)[action.payload.id] =
        action.payload;
    },
    updateLogicContentImageShowType: (state, action) => {
      state.contentImageShowType = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateLogicContentImageShowType,addLogicNode } = logicSlice.actions;

export default logicSlice.reducer;
