import { createSlice } from "@reduxjs/toolkit";

export interface IPs {
  rulerMinX: number;
  rulerMinY: number;
  tickUnit: number;
  offset: number;
  snap: number;
  panelWidth: number;
  panelHeight: number;
  panelLeft: number;
  panelTop: number;
}

export const panelSlice = createSlice({
  name: "panel",
  initialState: {
    rulerMinX: 0,
    rulerMinY: 0,
    snap: 5,
    offset: 30,
    tickUnit: 2,
    panelWidth: 1920,
    panelHeight: 1080,
    panelLeft: 0,
    panelTop: 0,
  },
  reducers: {
    updatePanelTickUnit: (state, action) => {
      state.tickUnit = action.payload;
    },
    updatePanelTop: (state, action) => {
      state.panelTop = action.payload;
    },
    updatePanelWidth: (state, action) => {
      state.panelWidth = action.payload;
    },
    updatePanelHeight: (state, action) => {
      state.panelHeight = action.payload;
    },
    updatePanelLeft: (state, action) => {
      state.panelLeft = action.payload;
    },
    updateRulerMinX: (state, action) => {
      state.rulerMinX = action.payload;
    },
    updateRulerMinY: (state, action) => {
      console.log(action, "actionsss");
      state.rulerMinY = action.payload;
    },
  },
});
// 每个 case reducer 函数会生成对应的 Action creators
export const {
  updateRulerMinX,
  updatePanelTop,
  updatePanelHeight,
  updatePanelLeft,
  updatePanelWidth,
  updatePanelTickUnit,
  updateRulerMinY,
} = panelSlice.actions;

export default panelSlice.reducer;
