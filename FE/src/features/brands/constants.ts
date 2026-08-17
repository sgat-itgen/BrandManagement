import type { BrandStatus } from './types'

export type ViewMode = 'card' | 'table'

export type Filters = {
  search: string
  company: '' | import('./types').CompanyCode
  status: '' | BrandStatus
  type: string
  agency: string
}

export const emptyFilters: Filters = {
  search: '',
  company: '',
  status: '',
  type: '',
  agency: '',
}

export const statusOrder: BrandStatus[] = ['granted', 'expired', 'pending', 'rejected']

export const chartColors: Record<BrandStatus, string> = {
  granted: '#2E7D32',
  expired: '#B8860B',
  pending: '#1565C0',
  rejected: '#B3261E',
}
