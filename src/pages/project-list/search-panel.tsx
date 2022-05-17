import { userType , paramType } from './type'
import {Select , Input , Form } from 'antd'
export interface propsType{
  param:paramType,
  users:userType[],
  setParam:React.Dispatch<React.SetStateAction<paramType>>
}
export const SearchPanel =(props:propsType)=>{
  const { param , setParam , users} = props
  return (
    <Form style={{marginBottom:"2rem" }} layout='inline'>
      <Form.Item>
        <Input placeholder='项目名' type="text"  value={param.name} 
        onChange={evt=>setParam({...param,name:evt.target.value})}></Input>
      </Form.Item>
      <Select value={param.personId} 
      onChange={value=>setParam({...param , personId:value})}>
      <Select.Option value={""}> 负责人 </Select.Option>
      {
        users.map(user=><Select.Option key={user.id} value={user.id}> {user.name} </Select.Option>)
      }
      </Select>
    </Form>
  )
}
