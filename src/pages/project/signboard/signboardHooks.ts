import { useQuery } from "react-query";
import { useHttp } from "../../../hooks/https";
import { Signboard } from "../../../types/signboard";


export const useSignboard = (param?:Partial<Signboard>)=>{
  const client = useHttp()
  return useQuery<Signboard[]>(["kanbans",param],()=>client("kanbans",{data:param}))
}
