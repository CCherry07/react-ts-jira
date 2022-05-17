import {useState , useEffect } from 'react'
import * as qs from 'qs'

import { SearchPanel } from './search-panel'
import { List} from './list'

import { paramType ,projectType,userType } from './type'
import $http from '../../api'

import {clearObject} from '../../utils'
import { useMount , useDebounce } from '../../hooks'
export const ProjectListScreen = ()=>{
   const [param,setParam] = useState<paramType>({
    name:"",
    personId:''
  })

  const [users,setUsers] = useState<userType[]>([])
  const [projectList,setProjectList] = useState<projectType[]>([])

  //劫持param 使其停止输入 delay 后更新
  const debounceParam = useDebounce<paramType>(param , 800)

  useMount(()=>{
    $http( {url:"/users"}).then(res=>setUsers(res.data as unknown as userType[]))
  })

  useEffect(()=>{
    $http( {url:`/projects?${qs.stringify(clearObject(debounceParam))}`}).then(res=>setProjectList(res.data as unknown as projectType[]))
  },[debounceParam])

  return (
    <div>
      <SearchPanel users={ users } param={param} setParam={setParam} ></SearchPanel>
      <List projectList={projectList} users={users}></List>
    </div>
  )
}
