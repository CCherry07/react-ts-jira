import { userType , paramType } from './type'
import {Select , Input } from 'antd'
export interface propsType{
  param:paramType,
  users:userType[],
  setParam:React.Dispatch<React.SetStateAction<paramType>>
}
export const SearchPanel =(props:propsType)=>{
  const { param , setParam , users} = props
  return (
    <form>
      <div>
        <Input type="text"  value={param.name} 
        onChange={evt=>setParam({...param,name:evt.target.value})}></Input>
      </div>
      <Select value={param.personId} 
      onChange={value=>setParam({...param , personId:value})}>
      <Select.Option value={""}> 负责人 </Select.Option>
      {
        users.map(user=><Select.Option key={user.id} value={user.id}> {user.name} </Select.Option>)
      }
      </Select>
    </form>
  )
}
