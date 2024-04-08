import { configureStore } from "@reduxjs/toolkit";
import panelSlice from "./slice/panelSlice";
import attrSlice from "./slice/atterSlice";
import widgetMapSlice from "./slice/widgetMapSlice";
import widgetSlice from "./slice/widgetSlice";
import viewNodesSlice from "./slice/nodeSlice";
import logicSlice from "./slice/logicSlice";
import undoable from "redux-undo";
import viewNodesRecordSlice from "./slice/viewNodesRecordSlice";
import logicRecordSlice from "./slice/logicRecordSlice";
import configSlice from "./slice/configSlice";

export default configureStore({
  reducer: {
    panelSlice,
    attrSlice,
    widgetMapSlice,
    configSlice,
    widgetSlice,
    viewNodesRecordSlice: undoable(viewNodesRecordSlice, {
      undoType: "viewUndo",
      redoType: "viewRedo",
    }),
    logicRecordSlice: undoable(logicRecordSlice, {
      undoType: "logicUndo",
      redoType: "logicRedo",
    }),
    viewNodesSlice,
    logicSlice,
  },
});
