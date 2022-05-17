/* eslint-disable @typescript-eslint/no-unused-expressions */
import { getToken } from './auth'
import Axios from 'axios'
const $http = Axios.create({
  baseURL:process.env.REACT_APP_API_URL,
  timeout:5000,
})
$http.interceptors.request.use((config)=>{
  const token = getToken()
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${ token}` : ""
  }
  return config
})
$http.interceptors.response.use((response)=>{
  if (response.status === 401) {
    throw new Error("请重新登陆")
  }
  return response
}),(error:any)=>{
  return Promise.reject(error)
}

export default $http
