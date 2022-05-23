import styled from '@emotion/styled'
import { Spin } from 'antd'
import { PageContainer, Row } from "../../../components/components"
import { useDocTitle } from "../../../hooks"
import { Signboard } from "../../../types/signboard"
import { useTasks, useTaskSearchParams } from "../epic/taskHooks"
import { SearchPanel } from "../searchPanel"
import { CreateSignboard, SignboardColumn, TaskContainer } from "./components"
import { useProjectById, useSignboards, useSignboardSearchParams } from "./signboardHooks"

export const PageSignboard=()=>{
  useDocTitle("看板列表")
  const {data:signboards , isLoading:signboardsIsloading} = useSignboards(useSignboardSearchParams())
  const { data:currentProject } = useProjectById()
  const { isLoading:taskIsLoading  } = useTasks(useTaskSearchParams())
  const isLoading = signboardsIsloading || taskIsLoading

  return (
   <PageContainer> 
     <h1>{currentProject?.name} 看板 </h1>
     <SearchPanel></SearchPanel>
      { isLoading ? <Spin size='large'></Spin> : <TaskMain signboards={signboards}></TaskMain> }
   </PageContainer>
  )
}

const TaskMain = ({signboards}:{signboards?:Signboard[]})=>{
  return(
    <ColumnsContainer>
      {
        signboards?.map(signboard=>(
          <SignboardColumn signboard={signboard} key={signboard.id}></SignboardColumn>
        ))
      }
      <CreateSignboard></CreateSignboard>
    </ColumnsContainer>)
}

export const ColumnsContainer = styled("div")`
  border-radius: 10px;
  display: flex;
  overflow-x: scroll;
  flex: 1;
  ::-webkit-scrollbar{
    display:none;
  }
`;

