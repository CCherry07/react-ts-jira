import {projectType , userType} from './type'
import { Table , Dropdown , Button ,Menu , Modal} from 'antd'
import dayjs from 'dayjs'

import {TableProps } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { Pin } from '../../components/components'
import { useDeleteProjectWithQuery, useEditProjectWithQuery, useProjectsModal, useProjectsQueryKey } from './projectHooks'
interface ListProps extends TableProps<projectType>  {
  users:userType[]
  reFresh?:()=>void
}
export const  List =({ users, ...props }:ListProps) =>{

  // const { muTate } = useEditProject()
  const { mutate } = useEditProjectWithQuery(useProjectsQueryKey())
  const pinProject =(id:number)=>(pin:boolean)=>mutate({id,pin})

  
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
        <ControlDropdown project={project}></ControlDropdown>
      )
    }
  }]} {...props}>
  </Table>)
}


const ControlDropdown = ({project}:{project:projectType})=>{
  const {startEdit} = useProjectsModal()
  const editProject =(id:number)=>()=>startEdit(id)
  const { mutate:deleteProject } = useDeleteProjectWithQuery(useProjectsQueryKey())
  const confirmDeleteProject = (id:number,projectName:string)=>{
    Modal.confirm({
      title:`确定要删除这个<${projectName}>项目吗？`,
      content: `点击确定删除 <${projectName}>`,
      okText:"确定",
      cancelText:"取消",
      onOk(){
        deleteProject({id})
      }
    })
  }
  return (<Dropdown overlay={
    <Menu>
      <Menu.Item key={"edit"}>
        <Button type='link' onClick={editProject(project.id)}>编辑</Button>
      </Menu.Item>
      <Menu.Item key={"delete"}>
      <Button type='link' onClick={()=>(confirmDeleteProject(project.id,project.name))}>删除</Button>
      </Menu.Item>
    </Menu>
  }>
    <Button type='link'>...</Button>
  </Dropdown>)
}
