export interface paramType {
  name: string | undefined,
  personId: number | undefined
}

export interface userType {
  id: number,
  name: string,
  token: string
}

export interface projectType {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
} 
