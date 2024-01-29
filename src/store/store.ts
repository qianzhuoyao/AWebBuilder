import { configureStore } from "@reduxjs/toolkit";
import panelSlice from "./slice/panelSlice";
import attrSlice from "./slice/atterSlice";
import widgetMapSlice from "./slice/widgetMapSlice";
import widgetSlice from "./slice/widgetSlice";
export default configureStore({
  reducer: {
    panelSlice,
    attrSlice,
    widgetMapSlice,
    widgetSlice,
  },
});
