import { INs } from "../../../store/slice/nodeSlice.ts";
import { ILs } from "../../../store/slice/logicSlice.ts";

export type IConfigTypeParams = {
  NodesState: INs;
  logicState: ILs;
};
