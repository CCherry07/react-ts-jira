import { userType } from '../../pages/project-list/type'
import $http from '../index'
interface userinfo {
  username:string,
  password:string
}

const localstoreKey = "__token"
export const getToken=()=>{
  const token = window.localStorage.getItem(localstoreKey)
  return token
}

const setToken = (token:string)=>{
  window.localStorage.setItem(localstoreKey , token)
}

export const loginWithregister = async (userinfo:userinfo,type:"login" | "register" ):Promise<userType>=>{
  const url = type
  const { user }:{ user:userType } = await (await $http.post(url,userinfo)).data
     setToken(user.token)   
  return $http.post(url,userinfo)
}
export const loginOut = () => window.localStorage.removeItem(localstoreKey)
