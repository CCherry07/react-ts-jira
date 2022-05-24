import {Popover , Typography ,List   ,Button} from 'antd'
import { useData } from '../hooks';

import { useProjectsModal } from './project-list/projectHooks';
import { projectType } from './project-list/type';
export const ProjectPopover = ()=>{
  const {open} = useProjectsModal()
  const {data:projects} = useData<projectType[]>({remainingUrl:"projects"})
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
      <Button style={{padding:0}} type='link' onClick={()=>open()}> 创建项目 </Button>
    </List>
  </div>)
  return (
    <Popover placement='bottom' content={content}>
      <h3 style={{cursor:"pointer"}}> 项目 </h3>
    </Popover>
  )
}
