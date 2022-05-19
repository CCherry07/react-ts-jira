export interface paramType{
  name:string,
  personId:string
}

export interface userType{
  id:number,
  name:string,
  token:string
}

export interface projectType{
  id:number,
  name:string,
  personId:number,
  organization:string,
  created:number
  pin:boolean
} 
