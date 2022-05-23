import { PageContainer, Row } from "../../../components/components"
import { useDocTitle } from "../../../hooks"
import { SearchPanel } from "../searchPanel"
import { SignboardColumn } from "./components"
import { useProjectById, useSignboards, useSignboardSearchParams } from "./signboardHooks"

export const PageSignboard=()=>{
  useDocTitle("看板列表")
  const {data:signboards} = useSignboards(useSignboardSearchParams())
  const { data:currentProject } = useProjectById()
  return (
   <PageContainer> 
     <h1>{currentProject?.name} 看板 </h1>
     <SearchPanel></SearchPanel>
    <Row style={{alignItems:"normal"}} justifyContent="normal">
      {
        signboards?.map(signboard=>(
          <SignboardColumn signboard={signboard} key={signboard.id}></SignboardColumn>
        ))
      }
    </Row>
   </PageContainer>
  )
}
