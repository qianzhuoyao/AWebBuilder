import { useSelector } from "react-redux";
import { IAs } from "../store/slice/atterSlice";
import { ICs } from "../store/slice/configSlice";
import { ILs } from "../store/slice/logicSlice";
import { INs } from "../store/slice/nodeSlice";
import { IPs } from "../store/slice/panelSlice";
import { IWs } from "../store/slice/widgetMapSlice";
import { IWls } from "../store/slice/widgetSlice";
import { StateWithHistory } from "redux-undo";

interface IStore {
    attrSlice: IAs,
    configSlice: ICs,
    logicSlice: ILs
    viewNodesSlice: INs,
    panelSlice: IPs,
    widgetMapSlice: IWs,
    widgetSlice: IWls
}
export const useTakeData = () => {
    return useSelector((state: StateWithHistory<IStore>) => {
        return state;
    });
}

export const useTakeStoreHisrtory = () => {
    const { past } = useTakeData()
    return past
}

export const useTakePanel = () => {
    return useTakeData().present.panelSlice
}

export const useTakeConfig = () => {
    return useTakeData().present.configSlice
}

export const useTakeAttr = () => {
    return useTakeData().present.attrSlice
}
export const useTakeWidgetMap = () => {
    return useTakeData().present.widgetMapSlice
}
export const useTakeWidget = () => {
    return useTakeData().present.widgetSlice
}