import { userType , projectType } from './type'
import { Input , Form } from 'antd'
import { UserSelect } from '../../components/components';
export interface propsType{
  param: Partial<Pick<projectType, "name" | "personId">>;
  users:userType[],
  setParam:(params: Partial<{ name: unknown; personId: unknown; }>) => void
}
export const SearchPanel =(props:propsType)=>{
  const { param , setParam} = props
  return (
    <Form style={{marginBottom:"2rem" }} layout='inline'>
      <Form.Item>
        <Input placeholder='项目名' type="text"  value={param.name} 
        onChange={evt=>setParam({...param,name:evt.target.value})}></Input>
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName={"负责人"}
          value={param.personId}
          onChange={(value) =>
            setParam({
              ...param,
              personId: value,
            })
          }
        />
      </Form.Item>
      {/* <Select value={param.personId} 
      onChange={value=>setParam({...param , personId:value})}>
      <Select.Option value={0}> 负责人 </Select.Option>
      {
        users.map(user=><Select.Option key={user.id} value={user.id}> {user.name} </Select.Option>)
      }
      </Select> */}
    </Form>
  )
}
