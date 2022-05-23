import React from "react"
import { ReactNode } from "react";
import { userType } from "../pages/project-list/type"
import * as auth from '../api/auth'
import {http} from "../hooks/https";
import { useAsync, useMount } from "../hooks";
import { PullpageError, PullpageLoading } from "../components/components";
import { useQueryClient } from "react-query";
interface AuthForm {
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

const initUser =async () => {
  const token = auth.getToken()
  if (token) {
    const {user} = await http("me" , { token } )
    console.log(user);
    
    return user
  }
}

AuthContext.displayName = "AuthContext"
export const AuthProvider =( { children } : { children:ReactNode } )=>{
  const queryClient = useQueryClient()
  const { data:user , setData:setUser , run ,isError,isIdle ,isLoading ,error }  = useAsync<userType|null>()
  // const [user , setUser] = useState<userType|null>(null)
  const login = async (form:AuthForm ) => setUser(await auth.loginWithregister(form,"login"))
  const register = async (form:AuthForm) => setUser(await auth.loginWithregister(form,"register"))
  const loginOut = ()=>{
    auth.loginOut()
    queryClient.clear()
    setUser(null)
  }
  useMount(()=>{
    run(initUser())
  })
  if (isIdle||isLoading) {
    return <PullpageLoading></PullpageLoading>
  }
  if (isError) {
    return <PullpageError error={error}></PullpageError>
  }
  return <AuthContext.Provider  value={{user, login,loginOut , register}}  children={ children } ></AuthContext.Provider>
}
export  const  useAuth = ()=>{
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error(" useAuth 必须在 AuthProvider里使用 ")
  }
  return context
}
