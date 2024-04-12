import { pix_frame, pic_Img, pix_BX, pix_Table } from "../store/slice/nodeSlice.ts";

export const LOGIC_TYPE_LIST = [
  "remote",
  "viewSlot",
  "page",
  pic_Img,
  "input",
  pix_frame,
  pix_Table,
  "date",
  "hTrigger",
  "both",
  "dom",
  "text",
  "line",
  "timeOut",
  "mix",
  "timeInter",
  "cache",
  pix_BX,
  "filter",
] as const;

export type ILogicTypeList = (typeof LOGIC_TYPE_LIST)[number];
