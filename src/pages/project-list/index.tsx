import {useState } from 'react'
import styled from '@emotion/styled'

import { paramType ,projectType,userType } from './type'

import { SearchPanel } from './search-panel'
import { List} from './list'

import { useData, useDebounce, useQueryParam } from '../../hooks'
import { useProjectsSearchParams } from './projectHooks'

export const ProjectListScreen = ()=>{
  //劫持param 使其停止输入 delay 后更新
  const[param , setParam] = useProjectsSearchParams()
  const debounceParam = useDebounce(param , 800)
  const { data:projectList , isLoading} = useData<projectType[]>(
  { remainingUrl:"projects" ,queryOptions:debounceParam})
  const{data:users } = useData<userType[]>({ remainingUrl:"users"})
  return (
    <Container>
      <h2>项目列表</h2>
      <SearchPanel users={ users|| [] } param={param} setParam={setParam} ></SearchPanel>
      <List loading={isLoading} dataSource={projectList||[]} users={users || []}></List>
    </Container>
  )
}


// ProjectListScreen.whyDidYouRender = true


const Container = styled.div`
  padding: 3.2rem;
`
