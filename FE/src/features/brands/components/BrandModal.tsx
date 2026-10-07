import { X } from 'lucide-react'
import { useBrandMutations } from '../hooks/useBrands'
import type { BrandRecord } from '../types'
import { AddBrandForm } from './modal/AddBrandForm'
import { AgencyManagement } from './modal/AgencyManagement'
import { CompanyManagement } from './modal/CompanyManagement'
import { DetailForm } from './modal/DetailForm'
import { getModalSubtitle, getModalTitle } from './modal/modalText'
import { PasswordForm } from './modal/PasswordForm'
import type { ModalState } from './modal/types'

export type { ModalState } from './modal/types'

export function BrandModal({
  brands,
  companyLabels,
  modal,
  onClose,
}: {
  brands: BrandRecord[]
  companyLabels?: Record<string, string>
  modal: ModalState
  onClose: () => void
}) {
  const mutations = useBrandMutations()
  const brand = modal?.mode === 'detail' ? (brands.find((item) => item.id === modal.brandId) ?? null) : null

  if (!modal) return null

  const title = getModalTitle(modal, brand)
  const subtitle = getModalSubtitle(modal, brand, companyLabels)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brown-900/45 p-5" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-160 overflow-y-auto rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,.3)]" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-3 rounded-t-2xl border-b border-border bg-white px-4 py-5 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-brown-900">{title}</h2>
            <p className="mt-1 text-xs text-muted">{subtitle}</p>
          </div>
          <button className="text-muted hover:text-brown-900" onClick={onClose} type="button" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {modal.mode === 'detail' && brand ? (
          <DetailForm brand={brand} mutations={mutations} onClose={onClose} />
        ) : null}
        {modal.mode === 'add' ? (
          <AddBrandForm
            company={modal.company}
            onClose={onClose}
            createBrand={mutations.createBrand.mutateAsync}
            updateLogo={mutations.updateLogo.mutateAsync}
            isSaving={mutations.createBrand.isPending || mutations.updateLogo.isPending}
          />
        ) : null}
        {modal.mode === 'password' ? <PasswordForm onClose={onClose} /> : null}
        {modal.mode === 'manage-companies' ? <CompanyManagement brands={brands} /> : null}
        {modal.mode === 'manage-agencies' ? <AgencyManagement brands={brands} /> : null}
      </div>
    </div>
  )
}
