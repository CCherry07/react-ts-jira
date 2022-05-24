import { useCallback } from "react";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import { useQueryParam } from "../../../hooks";
import { useHttp } from "../../../hooks/https";
import { Signboard } from "../../../types/signboard";
import { Task } from "../../../types/task";
import { reorder } from "../../../utils/reorder";
import { useProject } from "../../project-list/projectHooks";



export const useSignboards = (param?:Partial<Signboard>)=>{
  const client = useHttp()
  return useQuery<Signboard[]>(["kanbans",param],()=>client("kanbans",{data:param}))
}
export const useProjectIdInUrl = () =>{
  const {pathname} = useLocation()
  const id = pathname.match(/projects\/(\d+)/)?.[1]
  return Number(id)
}


export const useProjectById = ()=>useProject(useProjectIdInUrl())
export const useSignboardSearchParams =()=>({projectId:useProjectIdInUrl()})
export const useSignboardQueryKey = ()=>["kanbans",useSignboardSearchParams()]


export const useAddSignboard = (queryKey:QueryKey)=>{
    const client = useHttp()
    return useMutation(
      (params:Partial<Signboard>)=>client("kanbans",{
        method:"POST",
        data:params
      }),
      useAddUpdate(queryKey)  
    )
}
export const useDeleteSignboard = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    ({id}:{id:number})=>client(`kanbans/${id}`,{
      method:"DELETE",
    }),
    useDeleteUpdate(queryKey)
  )
}

export const useAddTask = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    (params:Partial<Task>)=>client("tasks",{
      method:"POST",
      data:params
    }),
    useAddUpdate(queryKey)  
  )
}
export const useDeleteTask = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    ({id}:{id:number})=>client(`tasks/${id}`,{
      method:"DELETE",
    }),
    useDeleteUpdate(queryKey)
  )
}
export const useEditTask = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    (params:Partial<Task>)=>client(`tasks/${params.id}`,{
      method:"PATCH",
      data:params
    }),
    useEditUpdate(queryKey)
  )
}

export const useTask = (id:number)=>{
  const client = useHttp()
  return useQuery<Task>(
    ["project",{id}],
    ()=>client(`tasks/${id}`),
    {
      enabled:!!id
    }
  )
}

export const useTaskModal = ()=>{
  const [{editingTaskId} , setEditingTaskId] = useQueryParam(["editingTaskId"])
  const {data:editingTask , isLoading} = useTask(Number(editingTaskId))
  const startEdit = useCallback((id:number)=>{
    setEditingTaskId({editingTaskId:id})
  },[setEditingTaskId])

  const close = useCallback(()=>{
    setEditingTaskId({editingTaskId:""})
  },[setEditingTaskId])

  return {
    editingTaskId,
    editingTask,
    isLoading,
    startEdit,
    close
  }

}

export const useConfig = (queryKey:QueryKey, callback:(target:any,old?:any[])=>any[])=>{
  const queryClient = useQueryClient()
  return{
    onSuccess:()=>queryClient.invalidateQueries(queryKey[0] as string),
    async onMutate(target:any){
      const previousItems = queryClient.getQueriesData(queryKey)
      queryClient.setQueryData(queryKey,(old?:any[])=>{
        return callback(target , old)
      })
      return{previousItems}
    },
    onError(error:any,newItem:any,context:any){
      queryClient.setQueryData(queryKey,(context as { previousItems:Signboard[]}).previousItems)
    }
  }
}
export const useDeleteUpdate = (queryKey:QueryKey)=>
        useConfig(queryKey,(target,old)=>old?.filter(item=>item.id !== target.id)||[])
export const useEditUpdate = (queryKey:QueryKey)=>
        useConfig(queryKey,(target,old)=>old?.map(item=>item.id === target.id?{...item
        ,...target}:item)||[])
export const useAddUpdate = (queryKey:QueryKey)=>useConfig(queryKey,(target,old)=>old?[...old,target] : [])


export interface SortProps {
  //当前item
  fromId:number
  //目标位置item
  referenceId:number
  //前或后
  type:"before"|"after"
  formKanbanId?:number
  toKanbanId?:number
}
export const useReorderSignboards = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    (params:SortProps)=>{
      return client("kanbans/reorder",{
        method:"POST",
        data:params
      })
    },
    useReorderSignboardsConfig(queryKey)
)}

export const useReorderTasks = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation((params:SortProps)=>{
      return client("tasks/reorder",{
        method:"POST",
        data:params
      })
    },
    useReorderTasksConfig(queryKey)
)}

export const useReorderSignboardsConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }));

export const useReorderTasksConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[];
    return orderedList.map((item) =>
      item.id === target.fromId
        ? { ...item, kanbanId: target.toKanbanId }
        : item
    );
  });
