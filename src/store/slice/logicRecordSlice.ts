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
// 每个 case reducer 函数会生成对应的 Action creators
export const { recordLogicChange } = logicRecordSlice.actions;

export default logicRecordSlice.reducer;
