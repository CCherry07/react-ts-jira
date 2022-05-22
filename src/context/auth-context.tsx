import React from "react"
import { ReactNode } from "react";
import { userType } from "../pages/project-list/type"
import * as auth from '../api/auth'
import {http} from "../hooks/https";
import { useAsync, useMount } from "../hooks";
import { PullpageError, PullpageLoading } from "../components/components";
import { useDispatch, useSelector } from "react-redux";

import * as authStore from '../store/auth.slice'
export interface AuthForm {
  username:string,
  password:string
}


interface AuthContextValue {
  user:userType | null,
  login:(form: AuthForm) => Promise<void>,
  register:(form: AuthForm) => Promise<void>,
  loginOut:()=>void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)
 
export const initUser =async () => {
  const token = auth.getToken()
  if (token) {
    const {user} = await http("me" , { token } )
    console.log(user);
    return user
  }
}

AuthContext.displayName = "AuthContext"
export const AuthProvider =( { children } : { children:ReactNode } )=>{
  const {run ,isError,isIdle ,isLoading ,error }  = useAsync<AuthForm|null>()
  const dispatch:(...args:any[])=>Promise<AuthForm> = useDispatch()
  useMount(()=>{
    run(dispatch(authStore.bootstrap()))
  })
  if (isIdle||isLoading) {
    return <PullpageLoading></PullpageLoading>
  }
  if (isError) {
    return <PullpageError error={error}></PullpageError>
  }
  return <div>{children}</div>
}
export  const  useAuth = ()=>{
  const dispatch:(...args:any[])=>Promise<auth.userinfo> = useDispatch()
  const user = useSelector(authStore.selectUser)
  const login = (form:auth.userinfo)=>dispatch(authStore.login(form))
  const register = (form:auth.userinfo)=>dispatch(authStore.register(form))
  const loginOut = ()=>dispatch(authStore.loginOut())
  return {
    login,
    register,
    loginOut,
    user
  }
}
