import { useAuth } from '../context/auth-context'
import { Form, Input } from 'antd'
import { LongButton } from '.'
import { useAsync, useDocTitle } from '../hooks'
export const LoginPage = ({ onError }: { onError: (error: Error) => void }) => {
  const { login } = useAuth()
  const { run, isLoading } = useAsync(undefined, { processErrorBySelf: true })
  const handleSubmit = async (value: { username: string, password: string }) => {
    run(login(value)).catch(onError)
  }
  useDocTitle('login',false)
  return (
    <Form style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} onFinish={handleSubmit}>
      <Form.Item name={"username"} rules={[{ required: true, message: "请输入用户名" }]}>
        <Input placeholder='请输入用户名...' type="text" id="username" />
      </Form.Item>
      <Form.Item name={"password"} rules={[{ required: true, message: "请输入密码" }]}>
        <Input placeholder='请输入密码...' type="password" id="password" />
      </Form.Item>
      <LongButton loading={isLoading} htmlType="submit" type="primary">login</LongButton>
    </Form>
  )
}

