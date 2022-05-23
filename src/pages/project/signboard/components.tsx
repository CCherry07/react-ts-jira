import { Card , Input} from 'antd'
import { Signboard } from "../../../types/signboard";
import { useTaskQueryKey, useTasks, useTaskSearchParams, useTaskTypes } from "../epic/taskHooks";
import taskIcon from '../../../assets/task.svg'
import bugIcon from '../../../assets/bug.svg'
import styled from "@emotion/styled";
import { IdSelect } from '../../../components/components';
import { useEffect, useState } from 'react';
import { useAddSignboard, useAddTask, useProjectIdInUrl, useSignboardQueryKey } from './signboardHooks';
export const SignboardColumn = ({signboard}:{signboard:Signboard})=>{
    const {data:allTasks} = useTasks(useTaskSearchParams())
    const tasks = allTasks?.filter(task=>task.kanbanId === signboard.id)
    return (
      <Container>
          <h3> { signboard.name } </h3>
          <TaskContainer>
          {tasks?.map(task=>(
            <Card style={{marginBottom:".5rem" , borderRadius:"10px"}}>
              <div>
              {task.name}
              </div>
              <TaskTypeIcon id={task.typeId}></TaskTypeIcon>
            </Card>
         ))}
         <CreateTask kanbanId={signboard.id}></CreateTask>
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


export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: #e5faf0;
  display:flex ;
  flex-direction:column ;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`
export const TaskContainer = styled.div`
  overflow: scroll;
  flex:1;
  ::-webkit-scrollbar{
    display:none;
  }
`
export const TaskSelect = (props:Omit<React.ComponentProps<typeof IdSelect>,"options">)=>{
  const{data:Tasks } = useTaskTypes()
  return <IdSelect options={Tasks || []} {...props}></IdSelect>
}


// 创建看板
export const CreateSignboard=()=>{
  const [name , setName] = useState("")
  const projectId = useProjectIdInUrl()
  const { mutateAsync:addSignboard } = useAddSignboard(useSignboardQueryKey())

  const submit = async ()=>{
    await addSignboard({name,projectId})
    setName("")
  }

  return (
    <Container>
        <Input size='large' placeholder='新建看板名称'
          onPressEnter={submit}
          value={name}
          onChange={evt=>setName(evt.target.value)}
        ></Input>
    </Container>
  )
}
//创建 task
export const CreateTask = ({kanbanId}:{kanbanId:number})=>{
  const [name ,setName] = useState("")
  const { mutateAsync:addTask } = useAddTask(useTaskQueryKey())
  const projectId = useProjectIdInUrl()
  const [ inputMode , setInputMode] = useState(false)
  const submit = async()=>{
    await addTask({projectId , name ,kanbanId})
    setInputMode(false)
    setName("")
  }

  const toggle = ()=>setInputMode(!inputMode)

  useEffect(()=>{
    if (!inputMode) {
      setName("")
    }
  },[inputMode])

  if (!inputMode) {
    return <div style={{cursor:"pointer"}} onClick={toggle}> +创建事务 </div>
  }
  return <Card style={{borderRadius:"10px"}}>
    <Input onBlur={toggle} 
     placeholder="需要做些什么捏"
     autoFocus={true}
     onPressEnter={submit}
     value={name}
     onChange={evt=>setName(evt.target.value)}
     ></Input>
  </Card>
}
