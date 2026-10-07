import { apiRequest } from '../../shared/api/client'
import type { Agency, AgencyInput } from './types'

export function fetchAgencies() {
  return apiRequest<Agency[]>('/api/agencies')
}

export function createAgency(input: AgencyInput) {
  return apiRequest<Agency>('/api/agencies', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateAgency({ id, input }: { id: number; input: AgencyInput }) {
  return apiRequest<Agency>(`/api/agencies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
}

export function deleteAgency(id: number) {
  return apiRequest<void>(`/api/agencies/${id}`, { method: 'DELETE' })
}
