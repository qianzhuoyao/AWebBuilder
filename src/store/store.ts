import { configureStore, combineReducers, UnknownAction } from "@reduxjs/toolkit";
import panelSlice from "./slice/panelSlice";
import attrSlice from "./slice/atterSlice";
import widgetMapSlice from "./slice/widgetMapSlice";
import widgetSlice from "./slice/widgetSlice";
import viewNodesSlice from "./slice/nodeSlice";
import logicSlice from "./slice/logicSlice";
import undoable from "redux-undo";
import configSlice from "./slice/configSlice";
import { createSingleInstance } from "../comp/createSingleInstance";
import dayjs from "dayjs";



const updateHistoryRecord = () => {
  const history: { action: UnknownAction, time: string }[] = []
  return {
    history
  }
}

export const historySingle = createSingleInstance(updateHistoryRecord)

export const mappingTips = (action: UnknownAction) => {
  const tips: Record<string, string> = {
    "widget/updateShow": '展开操作栏',
    "nodes/addNode": `创建节点`,
    "nodes/updateTargets": '选中节点',
    "nodes/updatePosition": "更新位置",
    "nodes/updateRotate": "更新节点角度",
    "nodes/updateAlias": "更新节点别名",
    "widgetMap/updateWidgetMapShow": "更新映射表",
    "updateProviderShow": "打开映射表",
    "nodes/deleteListItem": "删除节点",
    "nodes/cloneNode": "复制节点",
    "panel/updateIsSelection": '开启批量选中',
    "nodes/updateZ": '修改层级',
    "nodes/updateSize": '修改节点大小',
    "nodes/updateInstance": '组件内容变更',
    "attr/updateAttrShow": '打开属性栏',
    "panel/updateCurrentSTab": '切换面板',
    "panel/updateShotImage": '更新快照',
    "logic/addLogicNode": '新增逻辑节点',
    "logic/updateLogicNode": '更新逻辑节点位置',
    "logic/setLogicTarget": '选中逻辑节点',
    "logic/deleteLogicNode": '删除逻辑节点'
  }
  return tips[action.type]
}

export default configureStore({
  reducer: undoable(combineReducers({
    panelSlice,
    attrSlice,
    widgetMapSlice,
    configSlice,
    widgetSlice,
    viewNodesSlice,
    logicSlice,
  }), {
    filter: (a, b, c) => {
      console.log(a, b, c, a.type, 'a,b,c')
      historySingle().history.unshift({
        action: a,
        time: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
      return a.type !== "nodes/updateTargets'" && a.type !== 'logic/updateLogicNode'
    }
  }),
});
