
import { useTakeData } from "./useTakeStore";





export const useTakeNodeData = () => {
    return useTakeData().present.viewNodesSlice
}

