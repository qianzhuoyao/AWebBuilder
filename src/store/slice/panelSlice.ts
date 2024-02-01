import { createSlice } from "@reduxjs/toolkit";

export interface IPs {
  rulerMinX: number;
  rulerMinY: number;
  tickUnit: number;
  isSelection: boolean;
  offset: number;
  lockScale: boolean;
  lockTransform: boolean;
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
    lockTransform: false,
    lockScale: false,
    isSelection: false,
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
    updateIsSelection: (state, action) => {
      console.log(action,'action-action')
      state.isSelection = action.payload;
    },
    updatePanelLockTransform: (state, action) => {
      state.lockTransform = action.payload;
    },
    updatePanelLockScale: (state, action) => {
      state.lockScale = action.payload;
    },
    updatePanelTickUnit: (state, action) => {
      if (!state.lockScale) {
        state.tickUnit = action.payload > 1 ? action.payload : 1;
      }
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
  updatePanelLockTransform,
  updatePanelTop,
  updatePanelLockScale,
  updatePanelHeight,
  updatePanelLeft,
  updateIsSelection,
  updatePanelWidth,
  updatePanelTickUnit,
  updateRulerMinY,
} = panelSlice.actions;

export default panelSlice.reducer;
