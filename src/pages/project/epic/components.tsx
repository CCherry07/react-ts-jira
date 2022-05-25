import {Drawer,DrawerProps,Button ,Spin,Form , Input } from 'antd'
import { useForm} from 'antd/es/form/Form'
import { useEffect } from 'react'
import { Row, ShowError, UserSelect } from '../../../components/components'
import { useAddEpic, useEpicQueryKey } from './epicHooks'

export const CreateEpic=(props:Pick<DrawerProps , "visible">&{onClose:()=>void})=>{
  const {mutate:addEpic , isLoading,error } = useAddEpic(useEpicQueryKey())
  const [form] = useForm()
  const onFinish = async(values:any)=>{
    await addEpic(values)
    props.onClose()
  }
  useEffect(()=>{
    form.resetFields()
  },[form,props.visible])
  return (
    <Drawer forceRender={true} destroyOnClose={true} 
      width="100%"
      visible={props.visible}
      onClose={props.onClose}
    >
      <Row flexDirection='column' justifyContent='normal' style={{height:"80vh"}}>
      {
        isLoading?<Spin size='large'></Spin>:<>
          <h1>创建任务组</h1>
          <ShowError error={error}></ShowError>
          <Form form={form} layout='vertical' style={{width:"40rem"}} onFinish={onFinish}>
            <Form.Item label="名称" name={"name"} rules={[{ required:true ,message:"请输入任务组名"}]}>
              <Input placeholder='请输入任务组名称'></Input>
            </Form.Item>
            <Form.Item style={{textAlign:"right"}}>
              <Button  loading={isLoading} type={"primary"} htmlType="submit">
                提交
              </Button>
            </Form.Item>  
          </Form> 
        </>
      }
      {/* <Button onClick={closeForm}></Button> */}
      </Row>
    </Drawer>
  )
}
