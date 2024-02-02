import { createSlice } from "@reduxjs/toolkit";

export interface IWs {
  show?: boolean;
  providerShow: boolean;
  //0 大预览 1 小缩略
  contentImageShowType: 0 | 1;
}

export const widgetMapSlice = createSlice({
  name: "widgetMap",
  initialState: {
    show: undefined,
    providerShow: false,
    contentImageShowType: 0,
  },
  reducers: {
    updateProviderShow: (state, action) => {
      state.providerShow = action.payload;
    },
    updateWidgetMapShow: (state, action) => {
      state.show = action.payload;
    },
    updateContentImageShowType: (state, action) => {
      state.contentImageShowType = action.payload;
    },
  },
});
export const { updateWidgetMapShow, updateProviderShow,updateContentImageShowType } =
  widgetMapSlice.actions;

export default widgetMapSlice.reducer;
