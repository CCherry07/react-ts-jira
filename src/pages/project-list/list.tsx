import {projectType , userType} from './type'
import { Table} from 'antd'
export const  List =({projectList,users}:{ projectList:projectType[] , users:userType[]}) =>{
  return (<Table pagination={ false } columns={[{title:"名称",dataIndex:"name",sorter:(a,b)=>a.name.localeCompare(b.name)},{
    title:"负责人",
    render(_ , project){
      return (
        <span>
          { users.find(user=>user.id === project.personId)?.name || "未知"}
        </span>
      )
    }
  }]} dataSource={projectList}>
  </Table>)
}
