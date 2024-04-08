import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ILogicNode } from "./logicSlice";

export interface ILRs {
  recordDesc: string;
  recordInfo?: ILogicNode;
}
const initialState: ILRs = {
  recordDesc: "",
};

export const logicRecordSlice = createSlice({
  name: "logicRecord",
  initialState,
  reducers: {
    recordLogicChange: (state, action: PayloadAction<ILRs>) => {
      state.recordDesc = action.payload.recordDesc;
      state.recordInfo = action.payload.recordInfo;
    },
  },
});
// 
export const { recordLogicChange } = logicRecordSlice.actions;

export default logicRecordSlice.reducer;
