import styled from '@emotion/styled'
import { Spin } from 'antd'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { PageContainer } from "../../../components/components"
import { useDocTitle } from "../../../hooks"
import { Signboard } from "../../../types/signboard"
import { useTasks, useTaskSearchParams } from "./taskHooks"
import { SearchPanel } from "../searchPanel"
import { CreateSignboard, SignboardColumn, TaskModal } from "./components"
import { Drag, Drop, DropChild } from './Dragdrop'
import { useDragEnd } from './DragdropHooks'
import { useProjectById, useSignboards, useSignboardSearchParams } from "./signboardHooks"

export const PageSignboard = () => {
  useDocTitle("看板列表")
  const { data: signboards, isLoading: signboardsIsloading } = useSignboards(useSignboardSearchParams())
  const { data: currentProject } = useProjectById()
  const { isLoading: taskIsLoading } = useTasks(useTaskSearchParams())
  const isLoading = signboardsIsloading || taskIsLoading
  const onDropEnd = useDragEnd()
  return (
    <DragDropContext onDragEnd={onDropEnd}>
      <PageContainer>
        <h1>{currentProject?.name} 看板 </h1>
        <SearchPanel></SearchPanel>
        {isLoading ? <Spin size='large'></Spin> :
          <TaskMain signboards={signboards}></TaskMain>
        }
        <TaskModal></TaskModal>
      </PageContainer>
    </DragDropContext>
  )
}

const TaskMain = React.forwardRef<HTMLDivElement, { signboards?: Signboard[] }>(({ signboards, ...props }, ref) => {
  return (
    <ColumnsContainer {...props} ref={ref}>
      <Drop droppableId='signboard' type='COLUMN' direction='horizontal'>
        <DropChild style={{ display: "flex" }}>
          {
            signboards?.map((signboard, index) => (
              <Drag key={signboard.id} draggableId={"signboard" + signboard.id} index={index}>
                <SignboardColumn signboard={signboard} key={signboard.id}></SignboardColumn>
              </Drag>
            ))
          }
        </DropChild>
      </Drop>
      <CreateSignboard></CreateSignboard>
    </ColumnsContainer>
  )
})

export const ColumnsContainer = styled("div")`
  border-radius: 10px;
  display: flex;
  overflow-x: scroll;
  flex: 1;
  ::-webkit-scrollbar{
    display:none;
  }
`;

