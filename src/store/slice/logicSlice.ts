import { createSlice } from "@reduxjs/toolkit";

export interface ILs {
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
}

export const logicSlice = createSlice({
  name: "widgetMap",
  initialState: {
    contentImageShowType: 0,
  },
  reducers: {
    updateLogicContentImageShowType: (state, action) => {
      state.contentImageShowType = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateLogicContentImageShowType } = logicSlice.actions;

export default logicSlice.reducer;
