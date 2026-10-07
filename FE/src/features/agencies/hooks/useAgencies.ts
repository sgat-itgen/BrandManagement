import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAgency, deleteAgency, fetchAgencies, updateAgency } from '../api'

export const agencyKeys = { all: ['agencies'] as const }

export function useAgencies() {
  return useQuery({
    queryKey: agencyKeys.all,
    queryFn: async () => (await fetchAgencies()).filter((agency) => agency.active),
  })
}

export function useAgencyMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: agencyKeys.all })
    void queryClient.invalidateQueries({ queryKey: ['brands'] })
  }

  return {
    createAgency: useMutation({ mutationFn: createAgency, onSuccess: invalidate }),
    updateAgency: useMutation({ mutationFn: updateAgency, onSuccess: invalidate }),
    deleteAgency: useMutation({ mutationFn: deleteAgency, onSuccess: invalidate }),
  }
}
