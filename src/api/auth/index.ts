import { http } from '../../hooks/https'
import { userType } from '../../pages/project-list/type'
interface userinfo {
  username: string,
  password: string
}

const localstoreKey = "__token"
export const getToken = () => {
  const token = window.localStorage.getItem(localstoreKey)
  return token
}

const setToken = (token: string) => {
  window.localStorage.setItem(localstoreKey, token)
}

export const loginWithregister = async (userinfo: userinfo, type: "login" | "register"): Promise<userType> => {
  const url = type
  const { user } = await http(url, { data: userinfo, method: "POST" })
  setToken(user.token)
  return http(url, { data: userinfo, method: "POST" })
}
export const logOut = () => window.localStorage.removeItem(localstoreKey)
