import { configureStore , Dispatch} from '@reduxjs/toolkit';
import { projectListSlice } from '../pages/project-list/projectList.slice';

export const rootReducer = {
  projectList:projectListSlice.reducer
}

export const store = configureStore({
  reducer:rootReducer
})

export type AppDispatch = Dispatch
export type RootState = ReturnType<typeof store.getState>
