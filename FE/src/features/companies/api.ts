import { apiRequest } from '../../shared/api/client'
import type { Company, CompanyInput } from './types'

export function fetchCompanies() {
  return apiRequest<Company[]>('/api/companies')
}

export function createCompany(input: CompanyInput) {
  return apiRequest<Company>('/api/companies', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateCompany({ id, input }: { id: number; input: CompanyInput }) {
  return apiRequest<Company>(`/api/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteCompany(id: number) {
  return apiRequest<void>(`/api/companies/${id}`, { method: 'DELETE' })
}
