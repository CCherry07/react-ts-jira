import { Input , Button } from 'antd'
import { Row, UserSelect } from '../../components/components'
import { useSetUrlSearchParam } from '../../hooks'
import { useTaskSearchParams } from './epic/taskHooks'
import { TaskSelect } from './signboard/components'
export const SearchPanel = ()=>{
  const searchParams  = useTaskSearchParams()
  const setSearchParams = useSetUrlSearchParam()
  
  const rest=()=>{
    setSearchParams({
      name:"",
      typeId:"",
      processorId:"",
      tagId:""
    })
  }

  return (<Row marginBottom={3} justifyContent="normal" marginRight={2}>
    <Input  style={{width:"20rem"}} placeholder="任务名" 
    value={searchParams.name} onChange={evt=>setSearchParams({name:evt.target.value})}></Input>

    <UserSelect defaultOptionName='经办人' 
    value={searchParams.processorId} onChange={value=>setSearchParams({processorId:value})}>
    </UserSelect>
    
    <TaskSelect defaultOptionName='类型'
     value={searchParams.typeId} onChange={value=>setSearchParams({typeId:value})}>
    </TaskSelect>
    <Button type='default' onClick={rest} > 清除筛选器</Button>
  </Row>)
}
