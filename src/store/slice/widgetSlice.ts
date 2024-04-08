import { createSlice } from "@reduxjs/toolkit";
import { MAIN_LAYER } from "../../contant";

export interface IWls {
  show: boolean;
  currentLayerId: string;
  inOperationForDraggable: boolean;
}

export const widgetSlice = createSlice({
  name: "widget",
  initialState: {
    show: false,
    currentLayerId: MAIN_LAYER,
    inOperationForDraggable: true,
  },
  reducers: {
    updateDraggable: (state, action) => {
      state.inOperationForDraggable = action.payload;
    },
    updateCurrentLayer: (state, action) => {
      state.currentLayerId = action.payload;
    },
    updateShow: (state, action) => {
      state.show = action.payload;
    },
  },
});
// 
export const { updateDraggable, updateCurrentLayer, updateShow } =
  widgetSlice.actions;

export default widgetSlice.reducer;
