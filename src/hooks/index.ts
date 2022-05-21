import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react"
import {clearObject} from '../utils'
import { useSearchParams } from "react-router-dom"
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

const useSafeDispatch = <T>(dispatch:(...args:T[])=>void)=>{
  const muntedRef = useMuntedRef()
  return useCallback((...args:T[])=>(muntedRef.current ? dispatch(...args):void 0) , [dispatch , muntedRef])
}

// processErrorBySelf
export const useAsync = <D>(initState?:State<D>,initConfig?:typeof defaultConfig)=>{
  const config = {...defaultConfig , ...initConfig }
  const [ state , dispatch ] = useReducer((state:State<D>, action:Partial<State<D>>)=>({...state , ...action}),{
    ...defaultInitState,
    ...initState
  })
  const [ retry , setReTry ] = useState(()=>()=>{})
  const safeDispatch = useSafeDispatch(dispatch)
  const setData = (data:D) => safeDispatch({
    data,
    status:"success",
    error:null
  })  
  const setError = (error:Error) => safeDispatch({
    data:null,
    status:"error",
    error
  })  
  const run  = useCallback(( promise:Promise<D> ,runConfig?:{ retry:()=>Promise<D> } )=>{
    if (!promise || !promise.then) {
      throw new Error("please Pass In The PromiseType !");
    } 
    setReTry(()=>()=>{
      if (runConfig?.retry) {
        run(runConfig.retry(),runConfig)
      }
    })
    safeDispatch({status:"loading"})
    return promise.then(data=>{
        setData(data)
      return data
    },(error=>{
      setError(error)
      if (config.processErrorBySelf) return Promise.reject(error)
      return error
    }))
  },[retry,setData,setError,state])
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
  let retry = () => http(`${parameter.remainingUrl}`,{data:queryOptions,...config})
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

// 实用reducer 改写useUndo

const SET = "SET"
const UNDO = "UNDO"
const REDO = "REDO"
const RESET = "RESET"

type ActionType<T> = {
  newPresent?:T,
  type: typeof SET|typeof UNDO|typeof REDO|typeof RESET
}
const undoReducer = <T>(state:StateType<T>,actions:ActionType<T>)=>{
    const {past , persent , future } = state
    const {type , newPresent } = actions
    switch (type) {
      case UNDO:{
        if (past.length === 0) return state
        const previous = past[past.length - 1]
        const newPast = past.slice(0,past.length - 1)
        return {
          persent:previous,
          past:newPast,
          future:[persent , ...future]
        }
      }
      case REDO:{
        if (past.length === 0) return state
        const next = future[0]
        const newFuture = future.slice(1)
        return {
          persent:next,
          past:[...past , persent],
          future:newFuture
       }
      }
      case SET:{
        return{
          past:[],
          persent:newPresent,
          future:[]
        }
      }
      case RESET:{
        return {
          past:[],
          persent:newPresent,
          future:[]
        }
      }
    }
  return state
}
//useUndo
interface StateType<T>{
  past:T[]
  persent:T
  future:T[]
}
export const useUndo = <T>(initPresent:T)=>{
  // usereducer
  const [state , dispatch] = useReducer(undoReducer,{
    past:[],
    persent:initPresent,
    future:[]
  }) 
  const canUndo = state.past.length !== 0
  const canRedo = state.future.length !== 0
  // useCallBack
  const undo =()=>dispatch({type:UNDO})
  const redo=()=>dispatch({type:REDO})
  const set = (newPresent:T)=>dispatch({type:SET,newPresent})
  const reset = (newPresent:T)=>dispatch({type:RESET,newPresent})
  return [
    state,
    { undo , redo , set,reset, canRedo , canUndo}
  ]
}
