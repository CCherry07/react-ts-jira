import { projectType } from "./type"
import { useAsync, useQueryParam} from "../../hooks"
import { useHttp } from "../../hooks/https";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";

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
  return useMutation(
    (params:Partial<projectType>)=>client(`projects/${params.id}`,{
      method:"PATCH",
      data:params
    }),{
      onSuccess:()=>queryClient.invalidateQueries("projects")
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
    (params:Partial<projectType>)=>client(`projects/${params.id}`,{
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


// 控制 modal 页打开
export const useProjectsModal = ()=>{
  const [{projectCreate},setProjectCreate] = useQueryParam(["projectCreate"])
  const open = ()=>setProjectCreate({projectCreate:true})
  const close = ()=>setProjectCreate({projectCreate:false})

  return {
    projectCreateOpen: projectCreate === "true",
    open,close
  }
}
 