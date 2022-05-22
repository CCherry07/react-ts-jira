import styled from '@emotion/styled'
import  { Button } from 'antd'
import {projectType,userType } from './type'

import { SearchPanel } from './search-panel'
import { List} from './list'

import { useData, useDebounce, useProjects } from '../../hooks'
import { useProjectsModal, useProjectsSearchParams } from './projectHooks'
import { Row, ShowError } from '../../components/components'
export const ProjectListScreen = ()=>{
  const { open } = useProjectsModal()
  //劫持param 使其停止输入 delay 后更新
  const[param , setParam] = useProjectsSearchParams()
  // const { data:projectList , isLoading ,retry} = useData<projectType[]>(
  // { remainingUrl:"projects" ,queryOptions:useDebounce(param , 800)})
  const { data:projectList ,isLoading ,error ,isError} = useProjects(useDebounce(param , 800))  
  const{data:users} = useData<userType[]>({ remainingUrl:"users"})
  return (
    <Container>
      <Row>
        <h2>项目列表</h2>
        <Button onClick={open} type='default'>
          创建项目
        </Button>
      </Row>
      <SearchPanel users={ users|| [] } param={param} setParam={setParam} ></SearchPanel>
      {isError? <ShowError error={error}/>
      :<List loading={isLoading} dataSource={projectList||[]} users={users || []}/>}
    </Container>
  )
}


// ProjectListScreen.whyDidYouRender = true
const Container = styled.div`
  padding: 3.2rem;
`
