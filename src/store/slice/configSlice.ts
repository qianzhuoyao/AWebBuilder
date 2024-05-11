import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IParseInPanel } from "../../struct/toJSON";

export interface ICs {
  duration: number;
  indexList: { id: string; name: string; img?: string }[];
  contentList: {
    token: string;
    total: number;
    records: IParseInPanel[];
  } | null;
}

export const configSlice = createSlice({
  name: "config",
  initialState: {
    duration: 0,
    indexList: [],
    contentList: {
      token:'',
      total: 0,
      records: [
        // {
        //   viewId: "1",
        //   viewName: "cac",
        //   webLogic: "",
        //   webNodes: "",
        //   webPanel: "",
        //   img: "",
        // },
        // {
        //   viewId: "2",
        //   viewName: "ca2c",
        //   webLogic: "",
        //   webNodes: "",
        //   webPanel: "",
        //   img: "",
        // },
      ],
    },
  } as ICs,
  reducers: {
    updateIndexList: (
      state,
      action: PayloadAction<{ id: string; name: string; img?: string }[]>
    ) => {
      state.indexList = action.payload;
    },
    updateDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    updateContentList: (
      state,
      action: PayloadAction<{
        token:string
        total: number;
        records: IParseInPanel[];
      } | null>
    ) => {
      state.contentList = action.payload;
    },
  },
});

export const { updateContentList, updateIndexList, updateDuration } =
  configSlice.actions;

export default configSlice.reducer;
