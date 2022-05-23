import { useQuery } from "react-query";
import { useHttp } from "../../../hooks/https";
import { Task } from "../../../types/task";


export const useTask = (param?:Partial<Task>)=>{
  const client = useHttp()
  return useQuery<Task[]>(["tasks",param],()=>client("tasks",{data:param}))
}
