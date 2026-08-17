import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { BrandRecord } from '../../types'

type AgencyDraft = {
  id: string
  name: string
}

export function AgencyManagement({ brands }: { brands: BrandRecord[] }) {
  const [agencies, setAgencies] = useState<AgencyDraft[]>(() =>
    [...new Set(brands.map((brand) => brand.agency || 'Chưa xác định'))]
      .sort()
      .map((name) => ({ id: name, name })),
  )
  const [newAgencyName, setNewAgencyName] = useState('')

  const addAgency = () => {
    const name = newAgencyName.trim()
    if (!name || agencies.some((agency) => agency.name === name)) return

    setAgencies((current) => [...current, { id: `custom-${Date.now()}`, name }])
    setNewAgencyName('')
  }

  return (
    <div className="px-6 py-5">
      <AgencyCreator name={newAgencyName} onAdd={addAgency} setName={setNewAgencyName} />
      <div className="space-y-2">
        {agencies.map((agency) => (
          <AgencyRow
            key={agency.id}
            agency={agency}
            count={brands.filter((brand) => (brand.agency || 'Chưa xác định') === agency.name).length}
            removeAgency={(id) => setAgencies((current) => current.filter((item) => item.id !== id))}
            updateAgency={(id, name) =>
              setAgencies((current) =>
                current.map((item) => (item.id === id ? { ...item, name } : item)),
              )
            }
          />
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted">
        Thêm/sửa/xóa trong popup là demo cục bộ cho danh mục. Khi có backend thật, quản lý đại diện SHTT nên tách thành API danh mục riêng.
      </p>
    </div>
  )
}

function AgencyCreator({
  name,
  onAdd,
  setName,
}: {
  name: string
  onAdd: () => void
  setName: (value: string) => void
}) {
  return (
    <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[1fr_auto]">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="field-input"
        placeholder="Tên đơn vị đại diện SHTT"
      />
      <button
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900"
        type="button"
      >
        <Plus size={15} />
        Thêm
      </button>
    </div>
  )
}

function AgencyRow({
  agency,
  count,
  removeAgency,
  updateAgency,
}: {
  agency: AgencyDraft
  count: number
  removeAgency: (id: string) => void
  updateAgency: (id: string, name: string) => void
}) {
  return (
    <div className="grid items-center gap-2 rounded-xl border border-border bg-cream/70 px-4 py-3 text-[12.5px] sm:grid-cols-[1fr_auto_auto]">
      <input
        value={agency.name}
        onChange={(event) => updateAgency(agency.id, event.target.value)}
        className="field-input font-semibold text-brown-800"
      />
      <span className="rounded-full bg-brown-800 px-2.5 py-0.5 text-[11.5px] font-bold text-white">{count}</span>
      <button
        onClick={() => removeAgency(agency.id)}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg"
        type="button"
      >
        <Trash2 size={13} />
        Xóa
      </button>
    </div>
  )
}
