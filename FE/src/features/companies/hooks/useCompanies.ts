import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCompany, deleteCompany, fetchCompanies, updateCompany } from '../api'

export const companyKeys = { all: ['companies'] as const }

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: async () => (await fetchCompanies()).filter((company) => company.active),
  })
}

export function useCompanyMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: companyKeys.all })
    void queryClient.invalidateQueries({ queryKey: ['brands'] })
  }

  return {
    createCompany: useMutation({ mutationFn: createCompany, onSuccess: invalidate }),
    updateCompany: useMutation({ mutationFn: updateCompany, onSuccess: invalidate }),
    deleteCompany: useMutation({ mutationFn: deleteCompany, onSuccess: invalidate }),
  }
}
