import { createSlice } from "@reduxjs/toolkit";

export interface IAs {
  //undefined 表示暂未操作，动画不开启
  show?: boolean;
}

export const attrSlice = createSlice({
  name: "attr",
  initialState: {
    show: undefined,
  },
  reducers: {
    updateShow: (state, action) => {
      state.show = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateShow } = attrSlice.actions;

export default attrSlice.reducer;
