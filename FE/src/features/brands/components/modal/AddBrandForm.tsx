import { Plus, Trash2, Upload } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { statusOrder } from '../../constants'
import { COMPANY_LABEL, COMPANY_ORDER, STATUS_META } from '../../mocks'
import type { BrandRecord, BrandStatus, CompanyCode, NewBrandInput } from '../../types'
import { Field } from '../../../../shared/ui'
import { useCompanies } from '../../../companies/hooks/useCompanies'
import { useAgencies } from '../../../agencies/hooks/useAgencies'

export function AddBrandForm({
  company,
  createBrand,
  onClose,
  updateLogo,
}: {
  company: CompanyCode
  createBrand: (input: NewBrandInput) => Promise<BrandRecord>
  onClose: () => void
  updateLogo: ({ id, file }: { id: number; file: File | null }) => Promise<unknown>
}) {
  const { data: companies = [] } = useCompanies()
  const { data: agencies = [] } = useAgencies()
  const [form, setForm] = useState<NewBrandInput>({
    company,
    mark: '',
    type: 'Logo',
    groups: '',
    appNo: '',
    certNo: '',
    filedDate: '',
    expiryDate: '',
    status: 'pending',
    agency: '',
    note: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState('')

  const update = (patch: Partial<NewBrandInput>) => setForm((current) => ({ ...current, ...patch }))

  const save = async () => {
    if (!form.mark.trim()) return
    const created = await createBrand(form)
    if (logoFile) await updateLogo({ id: created.id, file: logoFile })
    onClose()
  }

  const handleLogoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
    event.target.value = ''
  }

  return (
    <div className="space-y-3 px-6 py-5">
      <Field label="Pháp nhân">
        <select value={form.company} onChange={(event) => update({ company: event.target.value as CompanyCode })} className="field-input">
          {(companies.length
            ? companies.map((item) => ({ code: item.code, name: item.legalName }))
            : COMPANY_ORDER.map((item) => ({ code: item, name: COMPANY_LABEL[item] }))
          ).map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tên / mô tả nhãn hiệu *">
        <input value={form.mark} onChange={(event) => update({ mark: event.target.value })} className="field-input" placeholder="vd: Tên thương hiệu mới" />
      </Field>
      <Field label="Ảnh logo">
        <LogoPicker
          logoPreview={logoPreview}
          onClear={() => {
            setLogoFile(null)
            setLogoPreview('')
          }}
          onSelect={handleLogoSelect}
        />
      </Field>
      <hr className="border-border" />
      <BrandIdentityFields form={form} update={update} />
      <Field label="Trạng thái">
        <select value={form.status} onChange={(event) => update({ status: event.target.value as BrandStatus })} className="field-input">
          {statusOrder.map((item) => (
            <option key={item} value={item}>
              {STATUS_META[item].label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Đơn vị đại diện SHTT">
        <select value={form.agency} onChange={(event) => update({ agency: event.target.value })} className="field-input">
          <option value="">Chưa xác định</option>
          {agencies.map((agency) => <option key={agency.id} value={agency.name}>{agency.name}</option>)}
        </select>
      </Field>
      <Field label="Ghi chú">
        <textarea value={form.note} onChange={(event) => update({ note: event.target.value })} className="field-input min-h-20 resize-y" />
      </Field>
      <div className="flex justify-end">
        <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900" type="button">
          <Plus size={16} />
          Thêm thương hiệu
        </button>
      </div>
    </div>
  )
}

function LogoPicker({
  logoPreview,
  onClear,
  onSelect,
}: {
  logoPreview: string
  onClear: () => void
  onSelect: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {logoPreview ? (
        <img src={logoPreview} alt="" className="h-22.5 w-30 rounded-lg border border-border bg-cream object-contain" />
      ) : (
        <div className="grid h-22.5 w-30 place-items-center rounded-lg border border-dashed border-border bg-cream px-2 text-center text-[11px] text-muted">
          Chưa có ảnh
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brown-800 hover:bg-cream">
        <Upload size={15} />
        Tải ảnh logo
        <input className="hidden" type="file" accept="image/*" onChange={onSelect} />
      </label>
      {logoPreview ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-status-red/35 px-3 py-2 text-xs font-semibold text-status-red hover:bg-status-red-bg"
          type="button"
        >
          <Trash2 size={15} />
          Xóa ảnh
        </button>
      ) : null}
    </div>
  )
}

function BrandIdentityFields({
  form,
  update,
}: {
  form: NewBrandInput
  update: (patch: Partial<NewBrandInput>) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Loại nhãn hiệu">
        <input value={form.type} onChange={(event) => update({ type: event.target.value })} className="field-input" />
      </Field>
      <Field label="Nhóm SP/DV">
        <input value={form.groups} onChange={(event) => update({ groups: event.target.value })} className="field-input" />
      </Field>
      <Field label="Số đơn">
        <input value={form.appNo} onChange={(event) => update({ appNo: event.target.value })} className="field-input" />
      </Field>
      <Field label="Số bằng">
        <input value={form.certNo} onChange={(event) => update({ certNo: event.target.value })} className="field-input" />
      </Field>
      <Field label="Ngày nộp">
        <input value={form.filedDate} onChange={(event) => update({ filedDate: event.target.value })} className="field-input" />
      </Field>
      <Field label="Ngày hết hạn">
        <input value={form.expiryDate} onChange={(event) => update({ expiryDate: event.target.value })} className="field-input" />
      </Field>
    </div>
  )
}
