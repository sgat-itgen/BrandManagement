export interface Company {
  id: number
  code: string
  legalName: string
  active: boolean
}

export interface CompanyInput {
  code: string
  legalName: string
}
