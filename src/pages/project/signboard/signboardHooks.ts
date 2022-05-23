import { QueryKey, useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { useHttp } from "../../../hooks/https";
import { Signboard } from "../../../types/signboard";
import { useAddUpdate, useProject } from "../../project-list/projectHooks";


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
export const useSignboardQueryKey = ()=>["kanbans",useSignboardSearchParams]


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
