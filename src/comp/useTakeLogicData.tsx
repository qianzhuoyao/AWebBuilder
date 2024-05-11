
import { useTakeData } from "./useTakeStore";

export const useTakeLogicData = () => {
    return useTakeData().present.logicSlice

}