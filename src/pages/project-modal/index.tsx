import React, { useEffect } from 'react'
import {Drawer,Button ,Spin,Form , Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEditProjectWithQuery, useProjectsModal } from '../project-list/projectHooks'
import { useDocTitle } from '../../hooks'
import { ShowError, UserSelect } from '../../components/components'

export  function PageProjectModal() {
  const {projectCreateOpen , close,editingProject,isLoading} = useProjectsModal()
  const title = editingProject ? editingProject.name : "创建项目"
  useDocTitle(title,false)
  const useMutateProject = editingProject?useEditProjectWithQuery : useEditProjectWithQuery
  const { mutateAsync,error,isLoading:mutateLoading } = useMutateProject()
  const [form] = useForm()
  const onFinish = (values:{name:string,organization:string,personId:number})=>{
    mutateAsync({...editingProject,...values}).then(()=>{
      form.resetFields()
      close()
    })
  }

  useEffect(()=>{
    form.setFieldsValue(editingProject)
  },[editingProject,form])
  return (
    <Drawer onClose={close} visible={projectCreateOpen} width={"100vw"}>
      {
        isLoading?<Spin size='large'></Spin>:<>
          <h1>{title}</h1>
          <ShowError error={error}></ShowError>
          <Form form={form} layout='vertical' style={{width:"40rem"}} onFinish={onFinish}>
            <Form.Item label="名称" name={"name"} rules={[{ required:true ,message:"请输入项目名"}]}>
              <Input placeholder='请输入项目名称'></Input>
            </Form.Item>
            <Form.Item label="部门" name={"organization"} rules={[{ required:true ,message:"请输入部门名称"}]}>
              <Input placeholder='请输入部门名称'></Input>
            </Form.Item>  
            <Form.Item label="负责人" name={"personId"}>
              <UserSelect defaultOptionName='负责人' ></UserSelect>
            </Form.Item>  
            <Form.Item>
              <Button loading={mutateLoading} type={"primary"} htmlType="submit">
                提交
              </Button>
            </Form.Item>  
          </Form> 
        </>
      }
      <Button onClick={close}></Button>
    </Drawer>
  )
}
