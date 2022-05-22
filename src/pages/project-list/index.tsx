import styled from '@emotion/styled'
import  { Button } from 'antd'
import {projectType,userType } from './type'

import { SearchPanel } from './search-panel'
import { List} from './list'

import { useData, useDebounce } from '../../hooks'
import { useProjectsModal, useProjectsSearchParams } from './projectHooks'
import { Row } from '../../components/components'
import { Dispatch, SetStateAction } from 'react'

interface ProjectListScreenProps{

}

export const ProjectListScreen = ()=>{
  const { open } = useProjectsModal()
  //劫持param 使其停止输入 delay 后更新
  const[param , setParam] = useProjectsSearchParams()
  const { data:projectList , isLoading ,retry} = useData<projectType[]>(
  { remainingUrl:"projects" ,queryOptions:useDebounce(param , 800)})
  const{data:users } = useData<userType[]>({ remainingUrl:"users"})
  return (
    <Container>
      <Row>
        <h2>项目列表</h2>
        <Button onClick={open} type='default'>
          创建项目
        </Button>
      </Row>
      <SearchPanel users={ users|| [] } param={param} setParam={setParam} ></SearchPanel>
      <List reFresh={retry} loading={isLoading} dataSource={projectList||[]} users={users || []}></List>
    </Container>
  )
}


// ProjectListScreen.whyDidYouRender = true
const Container = styled.div`
  padding: 3.2rem;
`
