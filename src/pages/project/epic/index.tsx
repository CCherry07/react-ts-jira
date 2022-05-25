import styled from '@emotion/styled'
import { List , Button ,Divider} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mark, PageContainer, Row } from "../../../components/components"
import { Container } from '../signboard/components'
import { useProjectById } from "../signboard/signboardHooks"
import { useTasks } from '../signboard/taskHooks'
import { CreateEpic } from './components'
import { useDeleteEpic, useEpicQueryKey, useEpics, useEpicSearchParams } from "./epicHooks"

export const PageEpic=()=>{
  const { data:currentProject } = useProjectById()
  const {data:epics} = useEpics(useEpicSearchParams())
  const {data:tasks} = useTasks({projectId:currentProject?.id})
  const {mutate:deleteEpic} = useDeleteEpic(useEpicQueryKey())
  const [epicCreateOpen,setEpicCreateOpen] = useState(false)
  return (
    <PageContainer style={{width:"100vw"}}>
      <EpicContainer>
      <Row justifyContent='space-between'>
      <h1>{currentProject?.name} 任务组 </h1>
      <Button onClick={()=>setEpicCreateOpen(true)} type="default"> 创建任务组 </Button>
      </Row>
      <List dataSource={epics}      
      itemLayout={"vertical"}
      renderItem={(epic)=>(
        <List.Item style={{padding:0}}>
          {<Divider orientation='center' style={{margin:"1rem 0"}}>
            <Mark color='#3c85cd' keyword={epic.name} target={`任务 ${epic.name}`}></Mark>
            </Divider>}
          <List.Item.Meta title={<Row>
            <span> {epic.name}</span>
            <Button danger type='link' onClick={()=>deleteEpic({id:epic.id})}>删除</Button>
          </Row>} description={
            <div>
              <div>开始时间:{dayjs(epic.start).format("YYYY-MM-DD")}</div>
              <div>结束时间:{dayjs(epic.end).format("YYYY-MM-DD")}</div>
            </div>
          }/>
          <Row flexDirection='column'style={{alignItems:"flex-start"}}>
          {tasks?.filter(task=>task.epicId === epic.id)
          .map(task=><Link to={`/projects/${currentProject?.id}/signboard?editingTaskId=${task.id}`} key={task.id}>{task.name}</Link>)}
          </Row>
          
        </List.Item>
      )}
      >
      </List>
      <CreateEpic visible={epicCreateOpen} onClose={()=>setEpicCreateOpen(false)}></CreateEpic>
      </EpicContainer>
    </PageContainer>
  )
}


const EpicContainer = styled(Container)`
  overflow: scroll;
  flex:1;
  border-radius:10px;
  ::-webkit-scrollbar{
    display:none;
  }
`
