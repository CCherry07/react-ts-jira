import {projectType , userType} from './type'
import { Table} from 'antd'
import dayjs from 'dayjs'

import {TableProps } from 'antd/es/table'
import { Link } from 'react-router-dom'
import { Pin } from '../../components/components'
import { useEditProject } from './projectHooks'

interface ListProps extends TableProps<projectType>  {
  users:userType[]
}
export const  List =({ users, ...props }:ListProps) =>{
  const { muTate} = useEditProject()
  const pinProject =(id:number)=> async (pin:boolean)=> await muTate({id,pin})
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
  }}]} {...props}>
  </Table>)
}
