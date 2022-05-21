import React, { Dispatch, SetStateAction } from 'react';
import {Popover , Typography ,List   ,Button} from 'antd'
import { useData } from '../hooks';
import { projectType } from './project-list/type';
interface ProjectPopoverProps{
  setPageProjectModalOpen:Dispatch<SetStateAction<boolean>>
}
export const ProjectPopover = ({setPageProjectModalOpen}:ProjectPopoverProps)=>{
  const {data:projects , isLoading} = useData<projectType[]>({remainingUrl:"projects"})
  const pinnedProjects = projects?.filter(project => project.pin)
  const content = (<div style={{width:"20rem"}}>
    <Typography.Text type='secondary'>收藏项目</Typography.Text>
    <List>
      {  
        pinnedProjects?.map(project=>(
          <List.Item>
            <List.Item.Meta title={project.name}></List.Item.Meta>
          </List.Item>
        ))
      }
      <Button style={{padding:0}} type='link' onClick={()=>setPageProjectModalOpen(true)}> 创建项目 </Button>
    </List>
  </div>)
  return (
    <Popover placement='bottom' content={content}>
      <h3> 项目 </h3>
    </Popover>
  )
}
