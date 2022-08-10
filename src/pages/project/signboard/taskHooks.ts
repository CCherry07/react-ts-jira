import { useMemo } from "react";
import { useQuery } from "react-query";
import { useDebounce, useQueryParam } from "../../../hooks";
import { useHttp } from "../../../hooks/https";
import { Task, TaskType } from "../../../types/task";
import { useProject } from "../../project-list/projectHooks";
import { useProjectIdInUrl } from "./signboardHooks";


export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp()
  return useQuery<Task[]>(["tasks", param], () => client("tasks", { data: param }))
}

export const useTaskById = () => useProject(useProjectIdInUrl())

export const useTaskSearchParams = () => {
  const [param] = useQueryParam(["name", "typeId", "processorId", "tagId"])
  const projectId = useProjectIdInUrl()
  const taskName = useDebounce(param.name, 300)
  return useMemo(() => ({
    projectId,
    name: taskName,
    typeId: Number(param.typeId) || undefined,
    processorId: Number(param.processorId) || undefined,
    tagId: Number(param.tagId) || undefined
  }), [projectId, param, taskName])
}

export const useTaskQueryKey = () => ["tasks", useTaskSearchParams()]

export const useTaskTypes = () => {
  const client = useHttp()
  return useQuery<TaskType[]>(["taskTypes"], () => client("taskTypes"))
}
