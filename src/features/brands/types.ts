export type BrandStatus = 'granted' | 'expired' | 'pending' | 'rejected'

export type CompanyCode = 'TNHH' | 'SGAT' | 'DTPT' | 'SXTM'

export interface Attachment {
  id: number
  name: string
  size: number
  type: string
  url: string
}

export interface BrandRecord {
  id: number
  company: CompanyCode
  mark: string
  type: string
  groups: string
  appNo: string
  certNo: string
  filedDate: string
  expiryDate: string
  detail: string
  status: BrandStatus
  agency: string
  note: string
  logo: string
  isCustom: boolean
  assumption: boolean
  assumptionNote: string
  attachments: Attachment[]
  updatedAt?: string
}

export interface BrandPatch {
  status: BrandStatus
  expiryDate: string
  agency: string
  note: string
}

export interface NewBrandInput {
  company: CompanyCode
  mark: string
  type: string
  groups: string
  appNo: string
  certNo: string
  filedDate: string
  expiryDate: string
  status: BrandStatus
  agency: string
  note: string
}
