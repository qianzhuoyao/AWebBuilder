import { configureStore } from '@reduxjs/toolkit'
import panelSlice from './slice/panelSlice'

export default configureStore({
  reducer: {
    panelSlice
  }
})