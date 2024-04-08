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
    updateAttrShow: (state, action) => {
      state.show = action.payload;
    },
  },
});

export const { updateAttrShow } = attrSlice.actions;

export default attrSlice.reducer;
