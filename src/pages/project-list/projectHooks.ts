import { projectType } from "./type"
import { useAsync, useQueryParam, useSetUrlSearchParam} from "../../hooks"
import { useHttp } from "../../hooks/https";
import { useMemo } from "react";
import { QueryKey, useMutation, useQuery, useQueryClient } from "react-query";

export const useEditProject = () =>{
    const { run,...asyncResult } = useAsync()
    const client = useHttp();
    const muTate = (params:Partial<projectType>)=>{
        console.log(params);
        return run(client(`projects/${params.id}`,{
          method:"PATCH",
          data:params}))
    }
    return {
      muTate,
      ...asyncResult
    }
}

export const useEditProjectWithQuery = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    (params:Partial<projectType>)=>client(`projects/${params.id}`,{
      method:"PATCH",
      data:params
    }),
    useEditUpdate(queryKey)
  )
}
export const useDeleteProjectWithQuery = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    ({id}:{id:number})=>client(`projects/${id}`,{
      method:"DELETE",
    }),
    useDeleteUpdate(queryKey)
  )
}
export const useAddProject = () =>{
    const { run,...asyncResult } = useAsync()
    const client = useHttp();
    const muTate = (params:Partial<projectType>)=>{
        return run(client(`projects/${params.id}`,{
          method:"POST",
          data:params
        }))
    }
    return {
      muTate,
      ...asyncResult
    }
}

export const useConfig = (queryKey:QueryKey , callback:(target:any,old?:any[])=>any[])=>{
  const queryClient = useQueryClient()
  return{
    onSuccess:()=>queryClient.invalidateQueries("projects"),
    async onMutate(target:any){
      const previousItems = queryClient.getQueriesData(queryKey)
      queryClient.setQueryData(queryKey,(old?:any[])=>{
        return callback(target , old)
      })
      return{previousItems}
    },
    onError(error:any,newItem:any,context:any){
      queryClient.setQueryData(queryKey,(context as { previousItems:projectType[]}).previousItems)
    }
  }
}

export const useDeleteUpdate = (queryKey:QueryKey)=>
        useConfig(queryKey,(target,old)=>old?.filter(item=>item.id !== target.id)||[])
export const useEditUpdate = (queryKey:QueryKey)=>
        useConfig(queryKey,(target,old)=>old?.map(item=>item.id === target.id?{...item
        ,...target}:item)||[])
export const useAddUpdate = (queryKey:QueryKey)=>useConfig(queryKey,(target,old)=>old?[...old,target] : [])

// 使用usequery
export const useAddProjectWithQuery = (queryKey:QueryKey)=>{
  const client = useHttp()
  return useMutation(
    (params:Partial<projectType>)=>client("projects",{
      method:"POST",
      data:params
    }),
    useAddUpdate(queryKey)  
  )
}

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]),
    setParam,
  ] as const;
};

export const useProjectsQueryKey=()=>["projects",useProjectsSearchParams()[0]]

export const useProject = (id?:number)=>{
  const client = useHttp()
  return useQuery<projectType>(
    ["project",{id}],
    ()=>client(`projects/${id}`),
    {
      enabled:!!id
    }
  )
}


// 控制 modal 页打开
export const useProjectsModal = ()=>{
  const [{projectCreate},setProjectCreate] = useQueryParam(["projectCreate"])
  const [{editingProjectId},setEditingProjectId] = useQueryParam(["editingProjectId"])
  const {data:editingProject,isLoading} = useProject(Number(editingProjectId))
  const setUrlSearchParam = useSetUrlSearchParam()
  const open = ()=>setProjectCreate({projectCreate:true})
  const close = ()=>setUrlSearchParam({projectCreate:"",editingProjectId:""})
  
  const startEdit = (id:number)=>setEditingProjectId({editingProjectId:id})
  return {
    projectCreateOpen: projectCreate === "true" || !!editingProjectId,
    editingProject,isLoading,
    open,close,startEdit
  }
}

