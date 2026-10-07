import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAgencies, useAgencyMutations } from '../../../agencies/hooks/useAgencies'
import type { BrandRecord } from '../../types'

export function AgencyManagement({ brands }: { brands: BrandRecord[] }) {
  const { data: agencies = [], isLoading } = useAgencies()
  const { createAgency, updateAgency, deleteAgency } = useAgencyMutations()
  const [newName, setNewName] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [error, setError] = useState('')

  const addAgency = async () => {
    const name = newName.trim()
    if (!name) return
    setError('')
    try {
      await createAgency.mutateAsync({ name })
      setNewName('')
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể thêm đơn vị đại diện')
    }
  }

  const saveAgency = async (id: number) => {
    const name = drafts[id]?.trim()
    if (!name) return
    setError('')
    try {
      await updateAgency.mutateAsync({ id, input: { name } })
      setDrafts((current) => {
        const next = { ...current }
        delete next[id]
        return next
      })
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể cập nhật đơn vị đại diện')
    }
  }

  const removeAgency = async (id: number) => {
    setError('')
    try {
      await deleteAgency.mutateAsync(id)
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể xóa đơn vị đại diện')
    }
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      {error ? <p className="mb-3 rounded-lg border border-status-red/35 bg-status-red-bg px-3 py-2 text-xs font-semibold text-status-red">{error}</p> : null}
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[1fr_auto]">
        <input value={newName} onChange={(event) => setNewName(event.target.value)} className="field-input" placeholder="Tên đơn vị đại diện SHTT" />
        <button onClick={() => void addAgency()} disabled={createAgency.isPending} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900 disabled:cursor-not-allowed disabled:opacity-60" type="button"><Plus size={15} />Thêm</button>
      </div>
      <div className="space-y-2">
        {isLoading ? <p className="text-xs text-muted">Đang tải...</p> : null}
        {agencies.map((agency) => (
          <div key={agency.id} className="grid items-center gap-2 rounded-xl border border-border bg-cream/70 px-4 py-3 text-[12.5px] sm:grid-cols-[1fr_auto_auto]">
            <input value={drafts[agency.id] ?? agency.name} onChange={(event) => setDrafts((current) => ({ ...current, [agency.id]: event.target.value }))} onBlur={() => void saveAgency(agency.id)} className="field-input font-semibold text-brown-800" />
            <span className="rounded-full bg-brown-800 px-2.5 py-0.5 text-[11.5px] font-bold text-white">{brands.filter((brand) => brand.agency === agency.name).length}</span>
            <button onClick={() => void removeAgency(agency.id)} disabled={deleteAgency.isPending} className="inline-flex items-center justify-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg disabled:cursor-not-allowed disabled:opacity-50" type="button"><Trash2 size={13} />Xóa</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted">Dữ liệu danh mục được lưu qua API backend. Thay đổi tên sẽ gửi khi rời khỏi ô nhập.</p>
    </div>
  )
}
