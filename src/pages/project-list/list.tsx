import {projectType , userType} from './type'
import { Table , Dropdown , Button ,Menu} from 'antd'
import dayjs from 'dayjs'

import {TableProps } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { Pin } from '../../components/components'
import { useEditProjectWithQuery, useProjectsModal } from './projectHooks'
interface ListProps extends TableProps<projectType>  {
  users:userType[]
  reFresh?:()=>void
}
export const  List =({ users, ...props }:ListProps) =>{
  const {open,startEdit} = useProjectsModal()
  // const { muTate } = useEditProject()
  const { mutate } = useEditProjectWithQuery()
  const pinProject =(id:number)=>(pin:boolean)=>mutate({id,pin})
  const editProject =(id:number)=>()=>startEdit(id)
  
  return (<Table pagination={ false } columns={
    [
      {
        title:<Pin checked={true} disabled={true}/>,
        render(value,project){
          return <Pin checked={project.pin} onCheckedChange={pin=>pinProject(project.id)(pin)}></Pin>
        }
      },
      {title:"名称",dataIndex:"name",
    sorter:(a,b)=>a.name.localeCompare(b.name),
    render(value , project){
      return(
        <Link key={project.id} to={`${project.id}`}>{project.name}</Link>
      )
    }
    },
    { title:"部门",dataIndex:"organization" },{
    title:"负责人",
    render(_ , project){
      return (
        <span key={project.id}>
          { users.find(user=>user.id === project.personId)?.name || "未知"}
        </span>
      )
    }
  },{ title:"创建时间" , render(_,project){
    return (
      <span key={project.id}>
        { project.created ? dayjs(project.created).format("YYYY-DD-mm"):null}
      </span>
    )
  }},{
    title:"Control",
    render(value,project){
      return (
        <Dropdown overlay={
          <Menu>
            <Menu.Item key={"edit"}>
              <Button type='link' onClick={editProject(project.id)}>编辑</Button>
            </Menu.Item>
            <Menu.Item>
            <Button type='link'>删除</Button>
            </Menu.Item>
          </Menu>
        }>
          <Button type='link'>...</Button>
        </Dropdown>
      )
    }
  }]} {...props}>
  </Table>)
}
