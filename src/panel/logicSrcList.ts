import { pix_frame, pic_Img, pix_BX, pix_Table, pix_Text, pix_3d_frame } from "../store/slice/nodeSlice.ts";

export const LOGIC_TYPE_LIST = [
  "remote",
  "viewSlot",
  "page",
  pix_Text,
  pix_3d_frame,
  pic_Img,
  "input",
  "pix_input",
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
