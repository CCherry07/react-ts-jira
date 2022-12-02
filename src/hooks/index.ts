import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { clearObject, subset } from '../utils'
import { URLSearchParamsInit, useSearchParams } from "react-router-dom"
import { useHttp } from "./https"
import { useQuery } from "react-query"
import { paramType, projectType, userType } from "../pages/project-list/type"

export const useMount = (cb: () => void) => {
  useEffect(() => {
    cb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

// 截断 value delay 后更新新的value
export const useDebounce = function <T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounceValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounceValue
}

interface State<D> {
  error: Error | null
  data: D | null
  status: "idle" | "loading" | "error" | "success"
}
const defaultInitState: State<null> = {
  status: "idle",
  data: null,
  error: null
}

const defaultConfig = {
  processErrorBySelf: false
}

// processErrorBySelf
export const useAsync = <D>(initState?: State<D>, initConfig?: typeof defaultConfig) => {
  const config = { ...defaultConfig, ...initConfig }
  const [state, setState] = useState<State<D>>({
    ...defaultInitState,
    ...initState
  })
  const [retry, setReTry] = useState(() => () => { })
  const setData = useCallback((data: D) => setState({
    data,
    status: "success",
    error: null
  }), [])
  const setError = useCallback((error: Error) => setState({
    data: null,
    status: "error",
    error
  }), [])
  const muntedRef = useMuntedRef()

  const run = useCallback((promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
    if (!promise || !promise.then) {
      throw new Error("please Pass In The PromiseType !");
    }
    setReTry(() => () => {
      if (runConfig?.retry) {
        run(runConfig.retry(), runConfig)
      }
    })
    setState({ ...state, status: "loading" })
    return promise.then(data => {
      if (muntedRef.current) {
        setData(data)
      }
      return data
    }, (error => {
      setError(error)
      if (config.processErrorBySelf) return Promise.reject(error)
      return error
    }))
  }, [config.processErrorBySelf, muntedRef, setData, setError, state])
  return {
    isIdle: state.status === "idle",
    isLoading: state.status === "loading",
    isError: state.status === "error",
    isSuccess: state.status === "success",
    run,
    retry,
    setData,
    setError,
    ...state
  }
}


interface useDataParamType {
  remainingUrl: string,
  queryOptions?: { [key: string]: any; }
}

export const useData = <T>(parameter: useDataParamType) => {
  const { remainingUrl, queryOptions, ...config } = parameter
  const { run, ...result } = useAsync<T>()
  const [restData, setrestData] = useState(false)
  const http = useHttp()
  let retry = useCallback(() => http(`${parameter.remainingUrl}`, { data: queryOptions, ...config }), [config, http, parameter.remainingUrl, queryOptions])
  useEffect(() => {
    run(retry(), { retry })
  }, [parameter.queryOptions, retry, run])
  return {
    ...result,
    restData,
    setrestData
  }
}

export const useProjects = (param: Partial<paramType>) => {
  const client = useHttp()
  return useQuery<projectType[]>(["projects", param], () => {
    return client("projects", { data: param })
  })
}
export const useUsers = (param?: Partial<userType>) => {
  const client = useHttp()
  return useQuery<userType[]>(["users", param], () => {
    return client("users", { data: param })
  })
}


export const useDocTitle = (title: string, keepOnUnmount: boolean = true) => {
  //将传进来的title实用useRef 持久化，不受生命周期的影响
  const oldTitle = useRef(document.title).current
  //每一次都更新的doc Title
  useEffect(() => {
    document.title = title
  }, [title])

  //页面卸载时，将doc Title 置回前一次的title
  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle
      }
    }
  }, [keepOnUnmount, oldTitle])
}

type ParamType<T extends string> = { [k in T]: string }

// 获取query 里面的键值对
export const useQueryParam = <T extends string>(keys: T[]) => {
  const [searchParams] = useSearchParams()
  const setSearchParams = useSetUrlSearchParam()
  const [stateKeys] = useState(keys)
  return [
    useMemo(
      () => {
        return subset(Object.fromEntries(searchParams), stateKeys) as ParamType<T>
      }, [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in T]: unknown }>) => {
      return setSearchParams(params)
    }
  ] as const
}

// 更新Url Search query
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  return (params: { [key in string]: unknown }) => {
    const o = clearObject({ ...Object.fromEntries(searchParams), ...params }) as URLSearchParamsInit
    return setSearchParams(o)
  }
}


// usemuntedRef
export const useMuntedRef = () => {
  const muntedRef = useRef(false)
  useEffect(() => {
    muntedRef.current = true
    return () => {
      muntedRef.current = false
    }
  })
  return muntedRef
}
