import { useEffect, useState } from "react"

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
  state:"idle"|"loading"|"error"|"success"
}
const defaultInitState:State<null> ={
  state:"idle",
  data:null,
  error:null
}
export const useAsync = <D>(initState?:State<D>)=>{
  const [ state , setState ] = useState<State<D>>({
    ...defaultInitState,
    ...initState
  })

}
