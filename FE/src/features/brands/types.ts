export type BrandStatus = 'granted' | 'expired' | 'pending' | 'rejected'

export type CompanyCode = string

export interface Attachment {
  id: number
  kind?: string
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
  agencyId?: number
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
  agencyId?: number | null
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
