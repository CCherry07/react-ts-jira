import {useState } from 'react'
import styled from '@emotion/styled'

import { paramType ,projectType,userType } from './type'

import { SearchPanel } from './search-panel'
import { List} from './list'



import { useData, useDebounce } from '../../hooks'

export const ProjectListScreen = ()=>{
   const [param,setParam] = useState<paramType>({
    name:"",
    personId:''
  })

  //劫持param 使其停止输入 delay 后更新
  const debounceParam = useDebounce<paramType>(param , 800)
  const { data:projectList , isLoading , error } = useData<projectType[]>({ remainingUrl:"/projects", queryOptions:debounceParam})
  const{data:users } = useData<userType[]>({ remainingUrl:"/users"})

  // console.log(isLoading);
  

  return (
    <Container>
      <SearchPanel users={ users|| [] } param={param} setParam={setParam} ></SearchPanel>
      <List loading={isLoading}  dataSource={projectList||[]} users={users || []}></List>
    </Container>
  )
}


const Container = styled.div`
  padding: 3.2rem;
`
