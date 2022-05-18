import { useAuth } from '../../context/auth-context'
import { Form  , Input} from 'antd'
import {LongButton } from '../../unAuth-app'
import { useAsync } from '../../hooks'
export const LoginPage =({onError}:{onError:(error:Error)=>void})=>{
  const {login } = useAuth()
  const { run,error,isLoading } = useAsync()
  const handleSubmit = async (value:{ username:string , password:string })=>{
    // login({username , password}).catch(onError)
    run(login(value))
    if (error) {
      onError(error)
    }
  }
  return (
    <Form style={{display:"flex", flexDirection:"column",justifyContent:"center"}} onFinish={ handleSubmit }>
      <Form.Item name={ "username" } rules={[ {required:true , message:"请输入用户名"}]}>
        <Input placeholder='请输入用户名...' type="text" id="username"/>
      </Form.Item>
      <Form.Item name={"password"} rules={[{required:true , message:"请输入密码"}]}>
        <Input placeholder='请输入密码...' type="password" id="password"/>
      </Form.Item>
      <LongButton loading={isLoading} htmlType="submit" type="primary">登陆</LongButton>
    </Form>
  )
}

