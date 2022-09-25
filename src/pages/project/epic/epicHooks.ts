import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "../../../hooks/https";
import { Task } from "../../../types/task";
import { useProject } from "../../project-list/projectHooks";
import { useAddUpdate, useDeleteUpdate, useEditUpdate, useProjectIdInUrl } from "../signboard/signboardHooks";

export interface Epic {
  id: number
  name: string
  projectId: number
  start: number
  end: number
}


export const useEpics = (param?: Partial<Task>) => {
  const client = useHttp()
  return useQuery<Epic[]>(["epics", param], () => client("epics", { data: param }))
}

export const useEpicById = () => useProject(useProjectIdInUrl())

export const useEpicSearchParams = () => ({ projectId: useProjectIdInUrl() })
export const useEpicQueryKey = () => ["epics", useEpicSearchParams()]

export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Epic>) => client("epics", {
      method: "POST",
      data: params
    }),
    useAddUpdate(queryKey)
  )
}
export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) => client(`epics/${id}`, {
      method: "DELETE",
    }),
    useDeleteUpdate(queryKey)
  )
}
export const useEditEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Task>) => client(`tasks/${params.id}`, {
      method: "PATCH",
      data: params
    }),
    useEditUpdate(queryKey)
  )
}
