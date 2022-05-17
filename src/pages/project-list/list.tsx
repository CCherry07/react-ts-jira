import {projectType , userType} from './type'
import { Table} from 'antd'
import dayjs from 'dayjs'
export const  List =({projectList,users}:{ projectList:projectType[] , users:userType[]}) =>{
  return (<Table pagination={ false } columns={
    [{title:"名称",dataIndex:"name",sorter:(a,b)=>a.name.localeCompare(b.name)},{ title:"部门",dataIndex:"organization" },{
    title:"负责人",
    render(_ , project){
      return (
        <span>
          { users.find(user=>user.id === project.personId)?.name || "未知"}
        </span>
      )
    }
  },{ title:"创建时间" , render(_,project){
    return (
      <span>
        { project.created ? dayjs(project.created).format("YYYY-DD-mm"):null}
      </span>
    )
  } }]} dataSource={projectList}>
  </Table>)
}
