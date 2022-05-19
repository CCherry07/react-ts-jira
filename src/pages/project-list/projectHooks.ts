import $http from "../../api"
import { useAsync, useData } from "../../hooks"

import { projectType } from "./type"

export const useEditProject = () =>{
    const { run,...asyncResult } = useAsync()
    const muTate = (params:Partial<projectType>)=>{
        return run($http({
          url:`/projects/${params.id}`,
          method:"patch",
          data:params}).then(res=>res.data))
    }
    return {
      muTate,
      ...asyncResult
    }
}
export const useAddProject = () =>{
    const { run,...asyncResult } = useAsync()
    const muTate = (params:Partial<projectType>)=>{
        return run($http({
          url:`project/${params.id}`,
          method:"POST",
          data:params
        }))
    }
    return {
      muTate,
      ...asyncResult
    }
}
