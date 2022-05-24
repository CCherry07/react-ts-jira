import { List , Button} from 'antd'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { PageContainer, Row } from "../../../components/components"
import { useProjectById } from "../signboard/signboardHooks"
import { useTasks } from '../signboard/taskHooks'
import { useDeleteEpic, useEpicQueryKey, useEpics, useEpicSearchParams } from "./epicHooks"

interface PageEpicProps{

}
export const PageEpic=(props:PageEpicProps)=>{
  const { data:currentProject } = useProjectById()
  const {data:epics} = useEpics(useEpicSearchParams())
  const {data:tasks} = useTasks({projectId:currentProject?.id})
  const {mutate:deleteEpic} = useDeleteEpic(useEpicQueryKey())
  return (
    <PageContainer>
      <h1>{currentProject?.name} 任务组 </h1>
      <List dataSource={epics}      
      itemLayout={"vertical"}
      renderItem={(epic)=>(
        <List.Item>
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
    </PageContainer>
  )
}


