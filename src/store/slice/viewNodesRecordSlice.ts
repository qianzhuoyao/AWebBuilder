import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IViewNode } from "./nodeSlice";

export const RECORD_VIEW_NODE = "RECORD_VIEW_NODE" as const;

type IRecordViewType = typeof RECORD_VIEW_NODE;

export interface IARs {
  recordDesc: string;
  recordBelong?: "view" | "logic";
  recordViewType?: IRecordViewType;
  recordViewInfo?: Record<string, IViewNode>;
}
const initialState: IARs = {
  recordDesc: "",
};

export const viewNodesRecordSlice = createSlice({
  name: "viewNodesRecordSlice",
  initialState,
  reducers: {
    recordChange: (state, action: PayloadAction<IARs>) => {
      state.recordDesc = action.payload.recordDesc;
      state.recordViewInfo =
        action.payload.recordViewInfo || state.recordViewInfo;
      state.recordBelong = action.payload.recordBelong || state.recordBelong;
      state.recordViewType =
        action.payload.recordViewType || state.recordViewType;
    },
  },
});
// 
export const { recordChange } = viewNodesRecordSlice.actions;

export default viewNodesRecordSlice.reducer;
