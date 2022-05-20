import { useEffect, useMemo, useRef, useState } from "react"
// import qs from "qs"
// import {http} from "../hooks/https"
import {clearObject} from '../utils'
import { useSearchParams } from "react-router-dom"
import { AxiosRequestConfig, Method } from "axios"
import { useHttp } from "./https"

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
  const [ retry , setReTry ] = useState(()=>()=>{})
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
  const muntedRef = useMuntedRef() 

  const run  = ( promise:Promise<D> ,runConfig?:{ retry:()=>Promise<D> } )=>{
    if (!promise || !promise.then) {
      throw new Error("please Pass In The PromiseType !");
    } 
    setReTry(()=>()=>{
      if (runConfig?.retry) {
        run(runConfig.retry(),runConfig)
      }
    })
    setState({...state , status:"loading"})
    return promise.then(data=>{
      if (muntedRef.current) {
        setData(data)
      }
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
    retry,
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
  const {remainingUrl , queryOptions ,...config } = parameter
  const { run  ,...result} = useAsync<T>()
  const [restData,setrestData] = useState(false)
  const http = useHttp()
  let retry = () => http(`${parameter.remainingUrl}`,{data:queryOptions})
  useEffect(()=>{
    run(retry(),{retry})
   },[parameter.queryOptions])
   return {
     ...result,
     restData,
     setrestData
   }
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

type ParamType<T extends string> = {[k in T]:string}

export const useQueryParam =<T extends string>(keys:T[])=>{
  const [searchParams ,setSearchParams] = useSearchParams()
  return [
    useMemo(()=>keys.reduce((prev:ParamType<T>,key:T)=>{
      return {...prev,[key]:searchParams.get(key) || ""}
    },{} as ParamType<T>),[searchParams]),
    (params:Partial<{[key in T]:unknown}> )=>{
      const o = clearObject({...Object.fromEntries(searchParams) , ...params})
      return setSearchParams(o)
    }
  ] as const
}


// usemuntedRef
export const useMuntedRef = ()=>{
  const muntedRef = useRef(false) 
  useEffect(()=>{
   muntedRef.current = true
   return ()=> {
    muntedRef.current = false
   }
  })
  return muntedRef
}
