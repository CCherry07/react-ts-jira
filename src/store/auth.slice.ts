import { createSlice } from "@reduxjs/toolkit";
import { userType } from "../pages/project-list/type";
import * as auth from '../api/auth'
import { AppDispatch, RootState } from ".";
import { AuthForm, initUser } from "../context/auth-context";
interface State{
  user: userType | null
}

const initialState:State = {
  user:null
}

export const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    setUser(state,action){
      state.user = action.payload
    }
  }
})

const { setUser } = authSlice.actions

export const selectUser =(state:RootState)=>state.auth.user

export const login = (form:AuthForm) =>
    (dispatch:AppDispatch)=>
    auth.loginWithregister(form,"login").then((user)=>dispatch(setUser(user)))
export const register = (form:AuthForm) =>
    (dispatch:AppDispatch)=>
    auth.loginWithregister(form,"register").then((user)=>dispatch(setUser(user)))
export const loginOut =()=>(dispatch:AppDispatch)=>dispatch(setUser(null))
export const bootstrap=() =>(dispatch:AppDispatch)=>initUser().then(user=>dispatch(setUser(user)))
