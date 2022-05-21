import { configureStore , Dispatch} from '@reduxjs/toolkit';
import { projectListSlice } from '../pages/project-list/projectList.slice';
import { authSlice } from './auth.slice';

export const rootReducer = {
  projectList:projectListSlice.reducer,
  auth:authSlice.reducer
}

export const store = configureStore({
  reducer:rootReducer
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
