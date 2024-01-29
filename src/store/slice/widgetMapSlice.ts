import { createSlice } from "@reduxjs/toolkit";

export interface IWs {
  show?: boolean;
  providerShow: boolean;
}

export const widgetMapSlice = createSlice({
  name: "widgetMap",
  initialState: {
    show: undefined,
    providerShow: false,
  },
  reducers: {
    updateProviderShow: (state, action) => {
      state.providerShow = action.payload;
    },
    updateShow: (state, action) => {
      state.show = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateShow, updateProviderShow } = widgetMapSlice.actions;

export default widgetMapSlice.reducer;
