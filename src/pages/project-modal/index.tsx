import React, { useEffect } from 'react'
import { Drawer, Button, Spin, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useAddProjectWithQuery, useEditProjectWithQuery, useProjectsModal, useProjectsQueryKey } from '../project-list/projectHooks'
import { useDocTitle } from '../../hooks'
import { Row, ShowError, UserSelect } from '../../components/components'

export function PageProjectModal() {
  const { projectCreateOpen, close, editingProject, isLoading } = useProjectsModal()
  const title = editingProject ? editingProject.name : "创建项目"
  useDocTitle(title, true)
  const useMutateProject = editingProject ? useEditProjectWithQuery : useAddProjectWithQuery
  const { mutateAsync, error, isLoading: mutateLoading } = useMutateProject(useProjectsQueryKey())
  const [form] = useForm()
  const onFinish = (values: { name: string, organization: string, personId: number }) => {
    mutateAsync({ ...editingProject, ...values }).then(() => {
      form.resetFields()
      close()
    })
  }
  const closeForm = () => {
    form.resetFields()
    close()
  }
  useEffect(() => {
    form.setFieldsValue(editingProject)
  }, [editingProject, form])
  return (
    <Drawer forceRender onClose={closeForm} visible={projectCreateOpen} width={"100vw"}>
      <Row flexDirection='column' style={{ height: "80vh" }}>
        {
          isLoading ? <Spin size='large'></Spin> : <>
            <h1>{title}</h1>
            <ShowError error={error}></ShowError>
            <Form form={form} layout='vertical' style={{ width: "40rem" }} onFinish={onFinish}>
              <Form.Item label="名称" name={"name"} rules={[{ required: true, message: "请输入项目名" }]}>
                <Input placeholder='请输入项目名称'></Input>
              </Form.Item>
              <Form.Item label="部门" name={"organization"} rules={[{ required: true, message: "请输入部门名称" }]}>
                <Input placeholder='请输入部门名称'></Input>
              </Form.Item>
              <Form.Item label="负责人" name={"personId"}>
                <UserSelect defaultOptionName='负责人' ></UserSelect>
              </Form.Item>
              <Form.Item style={{ textAlign: "right" }}>
                <Button loading={mutateLoading} type={"primary"} htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Form>
          </>
        }
        <Button onClick={closeForm}></Button>
      </Row>
    </Drawer>
  )
}
