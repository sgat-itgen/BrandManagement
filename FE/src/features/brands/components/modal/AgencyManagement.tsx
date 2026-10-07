import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAgencies, useAgencyMutations } from '../../../agencies/hooks/useAgencies'
import type { BrandRecord } from '../../types'

export function AgencyManagement({ brands }: { brands: BrandRecord[] }) {
  const { data: agencies = [], isLoading } = useAgencies()
  const { createAgency, updateAgency, deleteAgency } = useAgencyMutations()
  const [newName, setNewName] = useState('')
  const [drafts, setDrafts] = useState<Record<number, string>>({})

  const addAgency = async () => {
    const name = newName.trim()
    if (!name) return
    await createAgency.mutateAsync({ name })
    setNewName('')
  }

  const saveAgency = async (id: number) => {
    const name = drafts[id]?.trim()
    if (!name) return
    await updateAgency.mutateAsync({ id, input: { name } })
    setDrafts((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  return (
    <div className="px-6 py-5">
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[1fr_auto]">
        <input value={newName} onChange={(event) => setNewName(event.target.value)} className="field-input" placeholder="Tên đơn vị đại diện SHTT" />
        <button onClick={() => void addAgency()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900" type="button"><Plus size={15} />Thêm</button>
      </div>
      <div className="space-y-2">
        {isLoading ? <p className="text-xs text-muted">Đang tải...</p> : null}
        {agencies.map((agency) => (
          <div key={agency.id} className="grid items-center gap-2 rounded-xl border border-border bg-cream/70 px-4 py-3 text-[12.5px] sm:grid-cols-[1fr_auto_auto]">
            <input value={drafts[agency.id] ?? agency.name} onChange={(event) => setDrafts((current) => ({ ...current, [agency.id]: event.target.value }))} onBlur={() => void saveAgency(agency.id)} className="field-input font-semibold text-brown-800" />
            <span className="rounded-full bg-brown-800 px-2.5 py-0.5 text-[11.5px] font-bold text-white">{brands.filter((brand) => brand.agency === agency.name).length}</span>
            <button onClick={() => void deleteAgency.mutateAsync(agency.id)} className="inline-flex items-center justify-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg" type="button"><Trash2 size={13} />Xóa</button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted">Dữ liệu danh mục được lưu qua API backend. Thay đổi tên sẽ gửi khi rời khỏi ô nhập.</p>
    </div>
  )
}
