import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCompanies, useCompanyMutations } from '../../../companies/hooks/useCompanies'
import type { BrandRecord } from '../../types'

export function CompanyManagement({ brands }: { brands: BrandRecord[] }) {
  const { data: companies = [], isLoading } = useCompanies()
  const { createCompany, updateCompany, deleteCompany } = useCompanyMutations()
  const [newCode, setNewCode] = useState('')
  const [newName, setNewName] = useState('')
  const [drafts, setDrafts] = useState<Record<number, { code?: string; legalName?: string }>>({})
  const [error, setError] = useState('')

  const addCompany = async () => {
    const code = newCode.trim().toUpperCase()
    const legalName = newName.trim()
    if (!code || !legalName) return
    setError('')
    try {
      await createCompany.mutateAsync({ code, legalName })
      setNewCode('')
      setNewName('')
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể thêm pháp nhân')
    }
  }

  const saveCompany = async (id: number) => {
    const company = companies.find((item) => item.id === id)
    const draft = drafts[id]
    if (!company || !draft) return
    const code = (draft.code ?? company.code).trim().toUpperCase()
    const legalName = (draft.legalName ?? company.legalName).trim()
    if (!code || !legalName) return
    setError('')
    try {
      await updateCompany.mutateAsync({ id, input: { code, legalName } })
      setDrafts((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể cập nhật pháp nhân')
    }
  }

  const removeCompany = async (id: number) => {
    setError('')
    try {
      await deleteCompany.mutateAsync(id)
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể xóa pháp nhân')
    }
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      {error ? <p className="mb-3 rounded-lg border border-status-red/35 bg-status-red-bg px-3 py-2 text-xs font-semibold text-status-red">{error}</p> : null}
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[120px_1fr_auto]">
        <input value={newCode} onChange={(event) => setNewCode(event.target.value)} className="field-input" placeholder="Mã" />
        <input value={newName} onChange={(event) => setNewName(event.target.value)} className="field-input" placeholder="Tên pháp nhân" />
        <button onClick={() => void addCompany()} disabled={createCompany.isPending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900 disabled:cursor-not-allowed disabled:opacity-60" type="button">
          <Plus size={15} />
          Thêm
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[620px] w-full border-collapse text-[12.5px]">
          <thead className="bg-brown-800 text-left text-[11px] uppercase tracking-wide text-white">
            <tr><th className="px-3 py-3 font-bold">Mã</th><th className="px-3 py-3 font-bold">Pháp nhân</th><th className="px-3 py-3 text-right font-bold">Số hồ sơ</th></tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={3} className="px-3 py-4 text-center text-muted">Đang tải...</td></tr> : null}
            {companies.map((company) => {
              const draft = drafts[company.id] ?? {}
              return (
                <tr key={company.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-3"><input value={draft.code ?? company.code} onChange={(event) => setDrafts((current) => ({ ...current, [company.id]: { ...current[company.id], code: event.target.value.toUpperCase() } }))} onBlur={() => void saveCompany(company.id)} className="field-input font-bold text-brown-900" /></td>
                  <td className="px-3 py-3"><input value={draft.legalName ?? company.legalName} onChange={(event) => setDrafts((current) => ({ ...current, [company.id]: { ...current[company.id], legalName: event.target.value } }))} onBlur={() => void saveCompany(company.id)} className="field-input text-brown-800" /></td>
                  <td className="px-3 py-3 text-right font-bold text-brown-900">
                    <span className="mr-3">{brands.filter((brand) => brand.company === company.code).length}</span>
                    <button onClick={() => void removeCompany(company.id)} disabled={deleteCompany.isPending} className="inline-flex items-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg disabled:cursor-not-allowed disabled:opacity-50" type="button"><Trash2 size={13} />Xóa</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11.5px] text-muted">Dữ liệu danh mục được lưu qua API backend. Thay đổi tên hoặc mã sẽ gửi khi rời khỏi ô nhập.</p>
    </div>
  )
}
