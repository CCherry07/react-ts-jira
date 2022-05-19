import { useEffect, useRef, useState } from "react"
import qs from "qs"
import $http from "../api"
import {clearObject} from '../utils'
import { useSearchParams } from "react-router-dom"

export const useMount =(cb:()=>void)=>{
  useEffect(()=>{
    cb()
  },[])
}

// 截断 value delay 后更新新的value
export const useDebounce = function<T>( value:T , delay:number):T{
  const [ debounceValue , setDebounceValue ] = useState(value)
  useEffect(()=>{
    const timer = setTimeout(()=>setDebounceValue(value),delay)
    return () => clearTimeout(timer)
  },[ value , delay ])
  return debounceValue
}

interface State<D>{
  error:Error|null
  data:D | null
  status:"idle"|"loading"|"error"|"success"
}
const defaultInitState:State<null> ={
  status:"idle",
  data:null,
  error:null
}

const defaultConfig = {
  processErrorBySelf:false
}

// processErrorBySelf
export const useAsync = <D>(initState?:State<D>,initConfig?:typeof defaultConfig)=>{
  const config = {...defaultConfig , ...initConfig }
  const [ state , setState ] = useState<State<D>>({
    ...defaultInitState,
    ...initState
  })

  const setData = (data:D) => setState({
    data,
    status:"success",
    error:null
  })  
  const setError = (error:Error) => setState({
    data:null,
    status:"error",
    error
  })  

  const run  = ( promise:Promise<D> )=>{
    if (!promise || !promise.then) {
      throw new Error("please Pass In The PromiseType !");
    }

    setState({...state , status:"loading"})
    return promise.then(data=>{
      setData(data)
      return data
    },(error=>{
      setError(error)
      if (config.processErrorBySelf) return Promise.reject(error)
      return error
    }))
  }
  return {
    isIdle:state.status ==="idle",
    isLoading:state.status ==="loading",
    isError:state.status ==="error",
    isSuccess:state.status ==="success",
    run,
    setData,
    setError,
    ...state
  }
}



interface useDataParamType{
  remainingUrl:string,
  queryOptions?:{ [key: string]: any;}
}

export const useData = <T>(parameter:useDataParamType)=>{
  const { run ,...result} = useAsync<T>()
  useEffect(()=>{
    run($http( {url:`${parameter.remainingUrl}?${qs.stringify(clearObject(parameter.queryOptions || {}))}`})
    .then(res=>res.data))
   },[parameter.queryOptions])
   return result
}


export const useDocTitle =(title:string,keepOnUnmount:boolean =true)=>{
  //将传进来的title实用useRef 持久化，不受生命周期的影响
  const oldTitle = useRef(document.title).current
  //每一次都更新的doc Title
  useEffect(()=>{
    document.title = title
  },[title])

  //页面卸载时，将doc Title 置回前一次的title
  useEffect(()=>{
    return ()=>{
      if (!keepOnUnmount) {
        document.title = oldTitle
      }
    }
  },[keepOnUnmount , oldTitle])
} 


export const useQueryParam = (keys:string[])=>{
  const [searchParams ] = useSearchParams()
  return keys.reduce((prev,key:string)=>{
    return {...prev,key:searchParams.get(key)}
  },{})
}
