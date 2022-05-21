import { configureStore , Dispatch} from '@reduxjs/toolkit';

export const rootReducer = {}

export const store = configureStore({
  reducer:rootReducer
})

export type AppDispatch = Dispatch
export type RootState = ReturnType<typeof store.getState>
