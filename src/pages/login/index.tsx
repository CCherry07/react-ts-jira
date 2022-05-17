import { useAuth } from '../../context/auth-context'
import { Form  , Input} from 'antd'
import {LongButton } from '../../unAuth-app'
export const LoginPage =()=>{
  const {login } = useAuth()
  const handleSubmit = async (value:{ username:string , password:string })=>{
    const username = value.username
    const password = value.password
    await login({username , password})
  }
  return (
    <Form style={{display:"flex", flexDirection:"column",justifyContent:"center"}} onFinish={ handleSubmit }>
      <Form.Item name={ "username" } rules={[ {required:true , message:"请输入用户名"}]}>
        <Input placeholder='请输入用户名...' type="text" id="username"/>
      </Form.Item>
      <Form.Item name={"password"} rules={[{required:true , message:"请输入密码"}]}>
        <Input placeholder='请输入密码...' type="password" id="password"/>
      </Form.Item>
      <LongButton htmlType="submit" type="primary">登陆</LongButton>
    </Form>
  )
}

