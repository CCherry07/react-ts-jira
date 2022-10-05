import { Card, Menu, Input, Form, Modal, Dropdown, Button } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Signboard } from "../../../types/signboard";
import { useTaskQueryKey, useTasks, useTaskSearchParams, useTaskTypes } from "./taskHooks";
import taskIcon from '../../../assets/task.svg'
import bugIcon from '../../../assets/bug.svg'
import styled from "@emotion/styled";
import { IdSelect, Mark, Row, UserSelect } from '../../../components/components';
import React, { useEffect, useState } from 'react';
import { useAddSignboard, useAddTask, useDeleteSignboard, useDeleteTask, useEditTask, useProjectIdInUrl, useSignboardQueryKey, useTaskModal } from './signboardHooks';
import { Task } from '../../../types/task';
import { Drag, Drop, DropChild } from './Dragdrop';
export const SignboardColumn = React.forwardRef<HTMLDivElement, { signboard: Signboard }>(
  ({ signboard, ...props }, ref) => {
    const { data: allTasks } = useTasks(useTaskSearchParams())
    const tasks = allTasks?.filter(task => task.kanbanId === signboard.id)
    return (
      <Container {...props} ref={ref}>
        <Row>
          <h3> {signboard.name} </h3>
          <SignboardControl signboard={signboard}></SignboardControl>
        </Row>
        <TaskContainer>
          <Drop type='ROW' direction='vertical' droppableId={String(signboard.id)}>
            <DropChild style={{ minHeight: "1px" }} >
              {tasks?.map((task, taskIdx) => (
                <Drag key={task.id} index={taskIdx} draggableId={"task" + task.id}>
                  <div>
                    <TaskCard task={task}></TaskCard>
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
          <CreateTask kanbanId={signboard.id} />
        </TaskContainer>
      </Container>
    )
  })

const TaskCard = ({ task }: { task: Task }) => {
  const { startEdit } = useTaskModal()
  const { name: keyword } = useTaskSearchParams()
  return (
    <Card onClick={() => startEdit(task.id)} style={{ marginBottom: ".5rem", borderRadius: "10px", cursor: "pointer" }}>
      <h4>
        <Mark target={task.name} keyword={keyword}></Mark>
      </h4>
      <TaskTypeIcon id={task.typeId}></TaskTypeIcon>
    </Card>
  )
}

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes()
  const name = taskTypes?.find(taskType => taskType.id === id)?.name
  if (!name) return null
  return <img alt={"taskType Icon"} width={"17rem"} src={name === "task" ? taskIcon : bugIcon}></img>
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
  border-radius:10px ;
  ::-webkit-scrollbar{
    display:none;
  }
`
export const TaskSelect = (props: Omit<React.ComponentProps<typeof IdSelect>, "options">) => {
  const { data: Tasks } = useTaskTypes()
  return <IdSelect options={Tasks || []} {...props}></IdSelect>
}


// 创建看板
export const CreateSignboard = () => {
  const [name, setName] = useState("")
  const projectId = useProjectIdInUrl()
  const { mutateAsync: addSignboard } = useAddSignboard(useSignboardQueryKey())

  const submit = async () => {
    await addSignboard({ name, projectId })
    setName("")
  }

  return (
    <Container>
      <Input style={{ borderRadius: "6px" }} size='middle' placeholder='新建看板名称'
        onPressEnter={submit}
        value={name}
        onChange={evt => setName(evt.target.value)}
      ></Input>
    </Container>
  )
}
//创建 task
export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const [name, setName] = useState("")
  const { mutateAsync: addTask } = useAddTask(useTaskQueryKey())
  const projectId = useProjectIdInUrl()
  const [inputMode, setInputMode] = useState(false)
  const submit = async () => {
    await addTask({ projectId, name, kanbanId })
    setInputMode(false)
    setName("")
  }

  const toggle = () => setInputMode(!inputMode)

  useEffect(() => {
    if (!inputMode) {
      setName("")
    }
  }, [inputMode])

  if (!inputMode) {
    return <div style={{ cursor: "pointer" }} onClick={toggle}> +创建事务 </div>
  }
  return <Card style={{ borderRadius: "10px", cursor: "pointer" }}>
    <Input onBlur={toggle}
      placeholder="需要做些什么捏"
      autoFocus={true}
      onPressEnter={submit}
      value={name}
      onChange={evt => setName(evt.target.value)}
    ></Input>
  </Card>
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export const TaskModal = () => {
  const [form] = useForm()
  const { editingTaskId, editingTask, close } = useTaskModal()
  const { mutateAsync: editTask, isLoading: editLoading } = useEditTask(editingTaskId)
  const { mutateAsync: delTask } = useDeleteTask(useTaskQueryKey())
  const onCancel = () => {
    close()
    form.resetFields()
  }
  const onOK = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() })
    close()
  }

  const startDelTask = (task?: Task) => {
    if (!task) return
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: <Mark target={`确定删除${task.name}任务吗？`} keyword={task.name}></Mark>,
      onOk() {
        delTask({ id: task.id })
      }
    })
    close()
  }

  useEffect(() => {
    form.setFieldsValue(editingTask)
  }, [form, editingTask])

  return <Modal forceRender={true} onCancel={onCancel} onOk={onOK} okText={"确认修改"} cancelText="取消修改"
    confirmLoading={editLoading}
    title="编辑任务"
    visible={!!editingTaskId}
  >
    <Form {...layout} initialValues={editingTask} form={form}>
      <Form.Item label="任务名" name={"name"}
        rules={[{ required: true, message: "请输入任务名" }]}
      >
        <Input placeholder='请输入任务名'></Input>
      </Form.Item>
      <Form.Item label="经办人" name={"processorId"}>
        <UserSelect defaultOptionName='经办人'></UserSelect>
      </Form.Item>
      <Form.Item label={`类型`} name={"typeId"}
        rules={[{ required: true, message: "请选择类型" }]}>
        <TaskSelect defaultValue={"task"}></TaskSelect>
      </Form.Item>
    </Form>
    <div style={{ textAlign: "right" }}>
      <Button onClick={() => startDelTask(editingTask)} size='middle' danger>Delete</Button>
    </div>
  </Modal>
}


export const SignboardControl = ({ signboard }: { signboard: Signboard }) => {
  const { mutateAsync } = useDeleteSignboard(useSignboardQueryKey())
  const StartDel = () => {
    Modal.confirm({
      okText: "确定",
      cancelText: "取消",
      title: <Mark target={`确定删除${signboard.name}看板吗？`} keyword={signboard.name}></Mark>,
      onOk() {
        mutateAsync({ id: signboard.id })
      }
    })
  }
  const Overlay = (<Menu>
    <Menu.Item>
      <Button style={{ padding: 0, border: 0 }} danger type='link' onClick={StartDel} >删除</Button>
    </Menu.Item>
  </Menu>)
  return (<Dropdown overlay={Overlay}>
    <Button type='link' danger style={{ padding: 0, border: 0, display: 'flex', color: "red" }}>...</Button>
  </Dropdown>)
}
