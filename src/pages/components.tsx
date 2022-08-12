import { Popover, Typography, List, Button } from 'antd'
import { useProjects, useUsers } from '../hooks';

import { useProjectsModal, useProjectsSearchParams } from './project-list/projectHooks';
export const ProjectPopover = () => {
  const { open } = useProjectsModal()
  const { data: projects, refetch } = useProjects(useProjectsSearchParams()[0])
  const pinnedProjects = projects?.filter(project => project.pin)
  const content = (<div style={{ width: "20rem" }}>
    <Typography.Text type='secondary'>收藏项目</Typography.Text>
    <List>
      {
        pinnedProjects?.map(project => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name}></List.Item.Meta>
          </List.Item>
        ))
      }
      <Button style={{ padding: 0 }} type='link' onClick={() => open()}> 创建项目 </Button>
    </List>
  </div>)
  return (
    <Popover onVisibleChange={() => refetch()} placement='bottom' content={content}>
      <h3 style={{ cursor: "pointer" }}> ITEMS </h3>
    </Popover>
  )
}


export const UserPopover = () => {
  // const {data:projects ,retry} = useData<projectType[]>({remainingUrl:"projects"})
  const { data: users, refetch } = useUsers()
  const content = (<div style={{ width: "20rem" }}>
    <Typography.Text type='secondary'>组员列表</Typography.Text>
    <List>
      {
        users?.map(user => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name}></List.Item.Meta>
          </List.Item>
        ))
      }
    </List>
  </div>)
  return (
    <Popover onVisibleChange={() => refetch()} placement='bottom' content={content}>
      <h3 style={{ cursor: "pointer" }}> USERS </h3>
    </Popover>
  )
}
