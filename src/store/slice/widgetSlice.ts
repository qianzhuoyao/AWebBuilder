import { createSlice } from '@reduxjs/toolkit';
import { MAIN_LAYER } from '../../contant';

export interface IWls {
  show: boolean;
  currentLayerId: string;
}

export const widgetSlice = createSlice({
  name: 'widget',
  initialState: {
    show: false,
    currentLayerId: MAIN_LAYER,
  },
  reducers: {
    updateCurrentLayer: (state, action) => {
      state.currentLayerId = action.payload;
    },
    updateShow: (state, action) => {
      state.show = action.payload;
    },

  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const { updateCurrentLayer, updateShow } = widgetSlice.actions;

export default widgetSlice.reducer;
