import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAttachments,
  createBrand,
  deleteBrand,
  fetchBrands,
  removeAttachment,
  updateBrand,
  updateBrandLogo,
} from '../api'

export const brandKeys = {
  all: ['brands'] as const,
}

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.all,
    queryFn: fetchBrands,
  })
}

export function useBrandMutations() {
  const queryClient = useQueryClient()
  const invalidateBrands = () => queryClient.invalidateQueries({ queryKey: brandKeys.all })

  return {
    updateBrand: useMutation({
      mutationFn: updateBrand,
      onSuccess: invalidateBrands,
    }),
    createBrand: useMutation({
      mutationFn: createBrand,
      onSuccess: invalidateBrands,
    }),
    deleteBrand: useMutation({
      mutationFn: deleteBrand,
      onSuccess: invalidateBrands,
    }),
    updateLogo: useMutation({
      mutationFn: ({ id, file }: { id: number; file: File | null }) =>
        updateBrandLogo(id, file),
      onSuccess: invalidateBrands,
    }),
    addAttachments: useMutation({
      mutationFn: ({ id, files }: { id: number; files: File[] }) => addAttachments(id, files),
      onSuccess: invalidateBrands,
    }),
    removeAttachment: useMutation({
      mutationFn: ({ brandId, attachmentId }: { brandId: number; attachmentId: number }) =>
        removeAttachment({ brandId, attachmentId }),
      onSuccess: invalidateBrands,
    }),
  }
}
