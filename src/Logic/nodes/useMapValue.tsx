
import { useTakeLogicData } from "../../comp/useTakeLogicData.tsx";

export const useMapValue = (id: string) => {
  const logicState = useTakeLogicData()
  return logicState.logicNodes[id];
};
