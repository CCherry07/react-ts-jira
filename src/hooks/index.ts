import { useEffect, useState } from "react"
import qs from "qs"
import $http from "../api"
import {clearObject} from '../utils'
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
export const useAsync = <D>(initState?:State<D>)=>{
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
