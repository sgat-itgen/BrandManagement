import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { COMPANY_LABEL, COMPANY_ORDER } from '../../mocks'
import type { BrandRecord } from '../../types'

type CompanyDraft = {
  id: string
  code: string
  name: string
}

export function CompanyManagement({ brands }: { brands: BrandRecord[] }) {
  const [companies, setCompanies] = useState<CompanyDraft[]>(() =>
    COMPANY_ORDER.map((company) => ({
      id: company,
      code: company,
      name: COMPANY_LABEL[company],
    })),
  )
  const [newCompanyCode, setNewCompanyCode] = useState('')
  const [newCompanyName, setNewCompanyName] = useState('')

  const updateCompany = (id: string, patch: Partial<Pick<CompanyDraft, 'code' | 'name'>>) => {
    setCompanies((current) =>
      current.map((company) => (company.id === id ? { ...company, ...patch } : company)),
    )
  }

  const addCompany = () => {
    const code = newCompanyCode.trim().toUpperCase()
    const name = newCompanyName.trim()
    if (!code || !name || companies.some((company) => company.code === code)) return

    setCompanies((current) => [...current, { id: `custom-${Date.now()}`, code, name }])
    setNewCompanyCode('')
    setNewCompanyName('')
  }

  return (
    <div className="px-6 py-5">
      <CompanyCreator
        code={newCompanyCode}
        name={newCompanyName}
        onAdd={addCompany}
        setCode={setNewCompanyCode}
        setName={setNewCompanyName}
      />
      <CompanyTable
        brands={brands}
        companies={companies}
        removeCompany={(id) => setCompanies((current) => current.filter((item) => item.id !== id))}
        updateCompany={updateCompany}
      />
      <p className="mt-3 text-[11.5px] text-muted">
        Thêm/sửa/xóa trong popup là demo cục bộ cho danh mục. Khi có backend thật, CRUD pháp nhân nên đi qua API riêng.
      </p>
    </div>
  )
}

function CompanyCreator({
  code,
  name,
  onAdd,
  setCode,
  setName,
}: {
  code: string
  name: string
  onAdd: () => void
  setCode: (value: string) => void
  setName: (value: string) => void
}) {
  return (
    <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[120px_1fr_auto]">
      <input value={code} onChange={(event) => setCode(event.target.value)} className="field-input" placeholder="Mã" />
      <input value={name} onChange={(event) => setName(event.target.value)} className="field-input" placeholder="Tên pháp nhân" />
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

function CompanyTable({
  brands,
  companies,
  removeCompany,
  updateCompany,
}: {
  brands: BrandRecord[]
  companies: CompanyDraft[]
  removeCompany: (id: string) => void
  updateCompany: (id: string, patch: Partial<Pick<CompanyDraft, 'code' | 'name'>>) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-[12.5px]">
        <thead className="bg-brown-800 text-left text-[11px] uppercase tracking-wide text-white">
          <tr>
            <th className="px-3 py-3 font-bold">Mã</th>
            <th className="px-3 py-3 font-bold">Pháp nhân</th>
            <th className="px-3 py-3 text-right font-bold">Số hồ sơ</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.id} className="border-b border-border last:border-b-0">
              <td className="px-3 py-3">
                <input
                  value={company.code}
                  onChange={(event) => updateCompany(company.id, { code: event.target.value.toUpperCase() })}
                  className="field-input font-bold text-brown-900"
                />
              </td>
              <td className="px-3 py-3">
                <input
                  value={company.name}
                  onChange={(event) => updateCompany(company.id, { name: event.target.value })}
                  className="field-input text-brown-800"
                />
              </td>
              <td className="px-3 py-3 text-right font-bold text-brown-900">
                <span className="mr-3">{brands.filter((brand) => brand.company === company.code).length}</span>
                <button
                  onClick={() => removeCompany(company.id)}
                  className="inline-flex items-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg"
                  type="button"
                >
                  <Trash2 size={13} />
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
