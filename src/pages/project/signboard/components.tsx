import { Card} from 'antd'
import { Signboard } from "../../../types/signboard";
import { useTasks, useTaskSearchParams, useTaskTypes } from "../epic/taskHooks";
import taskIcon from '../../../assets/task.svg'
import bugIcon from '../../../assets/bug.svg'
import styled from "@emotion/styled";
import { IdSelect } from '../../../components/components';
import { useData } from '../../../hooks';
import { TaskType } from '../../../types/task';
export const SignboardColumn = ({signboard}:{signboard:Signboard})=>{
    const {data:allTasks} = useTasks(useTaskSearchParams())
    const tasks = allTasks?.filter(task=>task.kanbanId === signboard.id)
    return (
      <Container>
        <h3> { signboard.name } </h3>
        <TaskContainer>
          {tasks?.map(task=>(
            <Card style={{marginBottom:".5rem"}}>
              <div>
              {task.name}
              </div>
              <TaskTypeIcon id={task.typeId}></TaskTypeIcon>
            </Card>
         ))}
         </TaskContainer>
      </Container>
    )
} 


const TaskTypeIcon = ({id}:{id:number})=>{
  const {data:taskTypes} = useTaskTypes()
  const name = taskTypes?.find(taskType=>taskType.id === id)?.name
  if (!name) return null
  return <img width={"17rem"} src={name === "task" ? taskIcon : bugIcon}></img>
}


const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: #e5faf0;
  display:flex ;
  flex-direction:column ;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`
const TaskContainer = styled.div`
  overflow: scroll;
  flex:1;
  ::-webkit-scrollbar{
    display:none ;
  }
`


export const TaskSelect = (props:Omit<React.ComponentProps<typeof IdSelect>,"options">)=>{
  const{data:Tasks } = useTaskTypes()
  return <IdSelect options={Tasks || []} {...props}></IdSelect>
}
