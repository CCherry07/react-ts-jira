import { useAuth } from '../context/auth-context'
import { Form  , Input } from 'antd'
import {useForm} from 'antd/es/form/Form'
import { LongButton } from './index'

import { useAsync } from '../hooks'
export const RegisterPage =({onError}:{onError:(error:Error)=>void})=>{
  const { register } = useAuth()
  const { run,isLoading } = useAsync(undefined , { processErrorBySelf:true })
  const [form] = useForm()
  const handleSubmit = async (value:{ username:string , password:string ,Cpassword:string})=>{
    const password = value.password
    if (password !== value.Cpassword) {
      onError(new Error("请确认两次输入的密码相同"))
      return
    }
    run(register(value)).catch(onError)
  }
  return (
    <Form form={form} style={{display:"flex", flexDirection:"column",justifyContent:"center"}} onFinish={ handleSubmit }>
    <Form.Item name={ "username" } rules={[ {required:true , message:"请输入用户名"}]}>
      <Input placeholder='请输入用户名...' type="text" id="username"/>
    </Form.Item>
    <Form.Item name={"password"} rules={[{required:true , message:"请输入密码"}]}>
      <Input  placeholder='请输入密码...' type="password" id="password"/>
    </Form.Item>
    <Form.Item name={"Cpassword"} rules={[{required:true , message:"请确认密码"}]}>
      <Input  placeholder='请确认密码' type="password" id="Cpassword"/>
    </Form.Item>
    <LongButton loading={isLoading} htmlType="submit" type="primary">注册</LongButton>
  </Form>
  )
}

