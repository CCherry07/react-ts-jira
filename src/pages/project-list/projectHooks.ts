import { projectType } from "./type"
import { useAsync, useQueryParam} from "../../hooks"
import { useHttp } from "../../hooks/https";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

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

export const useEditProjectWithQuery = ()=>{
  const client = useHttp()
  const queryClient = useQueryClient()
  const [searchParams] = useProjectsSearchParams()      
  const queryKey = ["projects",searchParams]
  return useMutation(
    (params:Partial<projectType>)=>client(`projects/${params.id}`,{
      method:"PATCH",
      data:params
    }),{
      onSuccess:()=>queryClient.invalidateQueries("projects"),
      async onMutate(target){
        const previousItems = queryClient.getQueriesData(queryKey)
        queryClient.setQueryData(queryKey,(old?:projectType[])=>{
          return old?.map(project=>project.id===target.id?{...project,...target}:project) || []
        })
        return{previousItems}
      },
      onError(error,newItem,context){
        const queryKey = ["projects",searchParams]
        queryClient.setQueryData(queryKey,(context as { previousItems:projectType[]}).previousItems)
      }
    })
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


// 使用usequery
export const useAddProjectWithQuery = ()=>{
  const client = useHttp()
  const queryClient = useQueryClient()
  return useMutation(
    (params:Partial<projectType>)=>client("projects",{
      method:"POST",
      data:params
    }),{
      onSuccess:()=>queryClient.invalidateQueries("projects")
    })
}

// 项目列表搜索的参数
export const useProjectsSearchParams = () => {
  const [param, setParam] = useQueryParam(["name", "personId"]);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

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
  const open = ()=>setProjectCreate({projectCreate:true})
  const close = ()=>{
    projectCreate?setProjectCreate({projectCreate:""}):
    setEditingProjectId({editingProjectId:""})
  }
  const startEdit = (id:number)=>setEditingProjectId({editingProjectId:id})
  return {
    projectCreateOpen: projectCreate === "true" || !!editingProject,
    editingProject,isLoading,
    open,close,startEdit
  }
}

