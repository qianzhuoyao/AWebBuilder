import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_PANEL_COLOR } from "../../contant";

export interface IPs {
  //操作面板指向是逻辑还是视图 STABS
  currentSTab: "logic" | "view";
  rulerMinX: number;
  rulerMinY: number;
  tickUnit: number;
  isSelection: boolean;
  offset: number;
  panelBgImage: string
  lockScale: boolean;
  lockTransform: boolean;
  snap: number;
  panelColor: string;
  panelWidth: number;
  panelHeight: number;
  panelLeft: number;
  panelTop: number;
  workSpaceName: string;
}

export const panelSlice = createSlice({
  name: "panel",
  initialState: {
    currentSTab: "view",
    rulerMinX: 0,
    lockTransform: false,
    lockScale: false,
    isSelection: false,
    rulerMinY: 0,
    snap: 5,
    panelBgImage: '',
    panelColor: DEFAULT_PANEL_COLOR,
    offset: 30,
    tickUnit: 2,
    workSpaceName: "工作空间",
    panelWidth: 1920,
    panelHeight: 1080,
    panelLeft: 0,
    panelTop: 0,
  },
  reducers: {
    updateWorkSpaceName: (state, action) => {
      state.workSpaceName = action.payload;
    },
    updatePanelImage: (state, action) => {
      state.panelBgImage = action.payload;
    },
    updatePanelColor: (state, action) => {
      state.panelColor = action.payload;
    },
    updateCurrentSTab: (state, action) => {
      state.currentSTab = action.payload;
    },
    updateIsSelection: (state, action) => {
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
    updatePanelAssign: (state, action: PayloadAction<Partial<IPs>>) => {
      // state.panelWidth = action.payload;
      Object.keys(action.payload).map(key => {
        state[key] = action.payload[key]
      })
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
      state.rulerMinY = action.payload;
    },
  },
});
// 
export const {
  updatePanelColor,
  updatePanelImage,
  updateCurrentSTab,
  updateWorkSpaceName,
  updateRulerMinX,
  updatePanelLockTransform,
  updatePanelTop,
  updatePanelLockScale,
  updatePanelHeight,
  updatePanelLeft,
  updateIsSelection,
  updatePanelAssign,
  updatePanelWidth,
  updatePanelTickUnit,
  updateRulerMinY,
} = panelSlice.actions;

export default panelSlice.reducer;
