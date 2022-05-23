import { useMemo } from "react";
import { useQuery } from "react-query";
import { useQueryParam } from "../../../hooks";
import { useHttp } from "../../../hooks/https";
import { Task, TaskType } from "../../../types/task";
import { useProject } from "../../project-list/projectHooks";
import { useProjectIdInUrl } from "../signboard/signboardHooks";


export const useTasks = (param?:Partial<Task>)=>{
  const client = useHttp()
  return useQuery<Task[]>(["tasks",param],()=>client("tasks",{data:param}))
}

export const useTaskById = ()=>useProject(useProjectIdInUrl())

export const useTaskSearchParams =()=>{
  const [ param , setParam ] = useQueryParam(["name","typeId","processorId","tagId"])
  const projectId = useProjectIdInUrl()
  return useMemo(()=>({
    projectId,
    name:param.name,
    typeId:Number(param.typeId) || undefined,
    processorId:Number(param.processorId) || undefined,
    tagId:Number(param.tagId) || undefined
  }),[projectId,param])
}

export const useTaskQueryKey = ()=>["tasks",useTaskSearchParams]

export const useTaskTypes = ()=>{
  const client = useHttp()
  return useQuery<TaskType[]>(["taskTypes"],()=>client("taskTypes"))
}
