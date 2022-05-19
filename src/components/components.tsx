
import { Spin , Typography ,Select} from 'antd';
// import { SelectProps} from 'antd/es/select'
import styled from "@emotion/styled";
import { userType } from '../pages/project-list/type';
import { useData } from '../hooks';
import React from 'react';

//Row
type flexDirection = "row"|"row-reverse"|"column"|"column-reverse"
type justifyContent = "center" | "space-around"|"space-between"|"space-evenly"
type alignItems = "center"
interface propsType{
  flexDirection?:flexDirection
  alignItems?:alignItems
  justifyContent?:justifyContent
  marginRight?:number
  marginBottom?:number
}
export const Row = styled.div<propsType>`
  display:flex;
  flex-direction:${(props)=>props.flexDirection?props.flexDirection : "row"} ;
  align-items: center;
  justify-content: ${(props)=>props.justifyContent?props.justifyContent : "space-between"} ;
  > * {
    margin: 0 0; 
    margin-right: ${(props)=>props.marginRight?props.marginRight + "rem":0};
    margin-bottom: ${(props)=>props.marginBottom?props.marginBottom + "rem":0};
  }
`
//PullpageError
const PullPage = styled.div`
  height:100vh ;
  display: flex;
  justify-content:center ;
  align-items:center ;
`

export const PullpageLoading = ()=>(
  <PullPage>
    <Spin size='large'></Spin>
  </PullPage>
)

export const PullpageError=({error}:{error:Error | null})=>(
  <PullPage>
    <Typography.Text type='danger'>{error?.message}</Typography.Text>
  </PullPage>
)

// IdSelect
type SelectProps = React.ComponentProps<typeof Select>

interface IdSelectType extends Omit<SelectProps,"value"|"onChange"|"defaultOptionsName"|"options">{
  value:string|number|null|undefined
  onChange:(value?:number)=>void
  defaultOptionsName?:string
  options:{name:string , id:number}[]
}

const toNumber = ( value:unknown)=> isNaN(Number(value)) ? 0 :Number(value)
export const IdSelect = (props:IdSelectType)=>{
  const { value , onChange , defaultOptionsName , options ,...otherProps} = props
  return (
    <Select
    {...otherProps}
    value={toNumber(value)}
     onChange={()=>onChange(toNumber(value)||undefined)}>
        {
          defaultOptionsName ? <Select.Option value={0} >
            {defaultOptionsName}
          </Select.Option> :null
        }
        {
          options?.map((option)=>(<Select.Option key={option.id} value={option.id} >
            {option.name}
          </Select.Option>)) 
        }
    </Select>
  )
}

// UserSelect

export const UserSelect = (props:Omit<React.ComponentProps<typeof IdSelect>,"options">)=>{
  const{data:users } = useData<userType[]>({ remainingUrl:"/users"})
  //{...{...props,options:users || []}}
  return <IdSelect options={users || []} {...props}></IdSelect>
}

