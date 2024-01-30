import { createSlice } from "@reduxjs/toolkit";

export interface IWls {
  show: boolean;

}

export const widgetSlice = createSlice({
  name: "widget",
  initialState: {
    show: false,
 
  },
  reducers: {
    updateShow: (state, action) => {
      state.show = action.payload;
    },
   
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateShow } = widgetSlice.actions;

export default widgetSlice.reducer;
