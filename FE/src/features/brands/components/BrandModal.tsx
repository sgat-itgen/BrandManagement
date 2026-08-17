import { Paperclip, Plus, Save, Trash2, Upload, X } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { COMPANY_LABEL, COMPANY_ORDER, STATUS_META } from '../mocks'
import { statusOrder } from '../constants'
import { useBrandMutations } from '../hooks/useBrands'
import type { BrandRecord, BrandStatus, CompanyCode, NewBrandInput } from '../types'
import { compact, formatSize } from '../utils'
import { Field } from '../../../shared/ui'
import type { ModalIntent } from './BrandViews'

export type ModalState = ModalIntent | null

export function BrandModal({
  brands,
  modal,
  onClose,
}: {
  brands: BrandRecord[]
  modal: ModalState
  onClose: () => void
}) {
  const mutations = useBrandMutations()
  const brand = modal?.mode === 'detail' ? (brands.find((item) => item.id === modal.brandId) ?? null) : null

  if (!modal) return null

  const title = getModalTitle(modal, brand)
  const subtitle = getModalSubtitle(modal, brand)

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brown-900/45 p-5" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-160 overflow-y-auto rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,.3)]" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-3 rounded-t-2xl border-b border-border bg-white px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-brown-900">
              {title}
            </h2>
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
          <AddBrandForm company={modal.company} onClose={onClose} createBrand={mutations.createBrand.mutateAsync} />
        ) : null}
        {modal.mode === 'password' ? <PasswordForm onClose={onClose} /> : null}
        {modal.mode === 'manage-companies' ? <CompanyManagement brands={brands} /> : null}
        {modal.mode === 'manage-agencies' ? <AgencyManagement brands={brands} /> : null}
      </div>
    </div>
  )
}

function getModalTitle(modal: Exclude<ModalState, null>, brand: BrandRecord | null) {
  if (modal.mode === 'add') return 'Thêm thương hiệu mới'
  if (modal.mode === 'password') return 'Đổi mật khẩu'
  if (modal.mode === 'manage-companies') return 'Quản lý pháp nhân'
  if (modal.mode === 'manage-agencies') return 'Quản lý đại diện SHTT'
  return brand?.mark ?? 'Chi tiết nhãn hiệu'
}

function getModalSubtitle(modal: Exclude<ModalState, null>, brand: BrandRecord | null) {
  if (modal.mode === 'add') return COMPANY_LABEL[modal.company]
  if (modal.mode === 'password') return 'Mô phỏng form đổi mật khẩu theo prototype'
  if (modal.mode === 'manage-companies') return 'Danh mục pháp nhân đang có hồ sơ nhãn hiệu'
  if (modal.mode === 'manage-agencies') return 'Danh mục đơn vị đại diện SHTT theo dữ liệu hiện tại'
  return brand ? `${COMPANY_LABEL[brand.company]} · Nhóm ${compact(brand.groups)}` : ''
}

function DetailForm({
  brand,
  mutations,
  onClose,
}: {
  brand: BrandRecord
  mutations: ReturnType<typeof useBrandMutations>
  onClose: () => void
}) {
  const [status, setStatus] = useState(brand.status)
  const [expiryDate, setExpiryDate] = useState(brand.expiryDate)
  const [agency, setAgency] = useState(brand.agency)
  const [note, setNote] = useState(brand.note)

  const save = async () => {
    await mutations.updateBrand.mutateAsync({ id: brand.id, patch: { status, expiryDate, agency, note } })
    onClose()
  }

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await mutations.updateLogo.mutateAsync({ id: brand.id, file })
    event.target.value = ''
  }

  const uploadAttachments = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length) await mutations.addAttachments.mutateAsync({ id: brand.id, files })
    event.target.value = ''
  }

  return (
    <div className="px-6 py-5">
      {brand.assumption ? (
        <div className="mb-4 rounded-lg border border-status-amber/35 bg-status-amber-bg px-3 py-2.5 text-xs text-[#8a6d00]">
          <b>Giả định / cần xác nhận:</b> {brand.assumptionNote}
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        {brand.logo ? (
          <img src={brand.logo} alt="" className="h-22.5 w-30 rounded-lg border border-border bg-cream object-contain" />
        ) : (
          <div className="grid h-22.5 w-30 place-items-center rounded-lg border border-dashed border-border bg-cream px-2 text-center text-[11px] text-muted">
            Chưa có ảnh logo
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-brown-800 hover:bg-cream">
          <Upload size={15} />
          Tải / thay ảnh logo
          <input className="hidden" type="file" accept="image/*" onChange={uploadLogo} />
        </label>
        {brand.logo ? (
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-status-red/35 px-3 py-2 text-xs font-semibold text-status-red hover:bg-status-red-bg"
            onClick={() => mutations.updateLogo.mutate({ id: brand.id, file: null })}
            type="button"
          >
            <Trash2 size={15} />
            Xóa ảnh logo
          </button>
        ) : null}
      </div>

      <InfoGrid brand={brand} />

      <div className="mt-5 space-y-3 border-t border-border pt-4">
        <Field label="Trạng thái">
          <select value={status} onChange={(event) => setStatus(event.target.value as BrandStatus)} className="field-input">
            {statusOrder.map((item) => (
              <option key={item} value={item}>
                {STATUS_META[item].label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ngày hết hạn / cập nhật">
          <input value={expiryDate} onChange={(event) => setExpiryDate(event.target.value)} className="field-input" />
        </Field>
        <Field label="Đơn vị đại diện SHTT">
          <input value={agency} onChange={(event) => setAgency(event.target.value)} className="field-input" />
        </Field>
        <Field label="Ghi chú theo dõi">
          <textarea value={note} onChange={(event) => setNote(event.target.value)} className="field-input min-h-20 resize-y" />
        </Field>
        <Field label="Văn bản đính kèm">
          <label className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border px-4 py-4 text-xs text-muted hover:border-gold-light hover:bg-cream">
            <span className="inline-flex items-center gap-2">
              <Paperclip size={15} />
              Bấm để chọn file đính kèm
            </span>
            <input className="hidden" type="file" multiple onChange={uploadAttachments} />
          </label>
          <AttachmentList brand={brand} removeAttachment={mutations.removeAttachment.mutate} />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={async () => {
            await mutations.deleteBrand.mutateAsync(brand.id)
            onClose()
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-status-red/35 px-3 py-2 text-xs font-semibold text-status-red hover:bg-status-red-bg"
          type="button"
        >
          <Trash2 size={15} />
          Xóa thương hiệu
        </button>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold text-brown-800 hover:bg-cream"
            type="button"
          >
            <X size={16} />
            Bỏ chỉnh sửa
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900" type="button">
            <Save size={16} />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

function AttachmentList({
  brand,
  removeAttachment,
}: {
  brand: BrandRecord
  removeAttachment: (attachmentId: number) => void
}) {
  return (
    <div className="mt-2 space-y-1.5">
      {brand.attachments.length ? (
        brand.attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-cream px-3 py-2 text-xs">
            <span className="truncate font-semibold text-brown-800">
              {attachment.name} <span className="font-normal text-muted">({formatSize(attachment.size)})</span>
            </span>
            <button onClick={() => removeAttachment(attachment.id)} className="text-status-red" type="button">
              Xóa
            </button>
          </div>
        ))
      ) : (
        <p className="text-[11px] text-muted">Chưa có văn bản đính kèm.</p>
      )}
    </div>
  )
}

function InfoGrid({ brand }: { brand: BrandRecord }) {
  const items = [
    ['Loại nhãn hiệu', compact(brand.type)],
    ['Nhóm sản phẩm/dịch vụ', compact(brand.groups)],
    ['Số đơn', compact(brand.appNo)],
    ['Số bằng', compact(brand.certNo)],
    ['Ngày nộp', compact(brand.filedDate)],
    ['Ngày hết hạn', compact(brand.expiryDate)],
    ['Diễn giải tình trạng (gốc)', compact(brand.detail)],
  ]

  return (
    <dl className="grid gap-x-5 gap-y-2 text-[12.5px] sm:grid-cols-2">
      {items.map(([label, value], index) => (
        <div key={label} className={index === items.length - 1 ? 'sm:col-span-2' : ''}>
          <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</dt>
          <dd className="mt-0.5 font-semibold text-brown-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

function AddBrandForm({
  company,
  createBrand,
  onClose,
}: {
  company: CompanyCode
  createBrand: (input: NewBrandInput) => Promise<BrandRecord>
  onClose: () => void
}) {
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

  const update = (patch: Partial<NewBrandInput>) => setForm((current) => ({ ...current, ...patch }))

  const save = async () => {
    if (!form.mark.trim()) return
    await createBrand(form)
    onClose()
  }

  return (
    <div className="space-y-3 px-6 py-5">
      <Field label="Pháp nhân">
        <select value={form.company} onChange={(event) => update({ company: event.target.value as CompanyCode })} className="field-input">
          {COMPANY_ORDER.map((item) => (
            <option key={item} value={item}>
              {COMPANY_LABEL[item]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Tên / mô tả nhãn hiệu *">
        <input value={form.mark} onChange={(event) => update({ mark: event.target.value })} className="field-input" placeholder="vd: Tên thương hiệu mới" />
      </Field>
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
        <input value={form.agency} onChange={(event) => update({ agency: event.target.value })} className="field-input" />
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

function PasswordForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3 px-6 py-5">
      <Field label="Mật khẩu hiện tại">
        <input className="field-input" type="password" />
      </Field>
      <Field label="Mật khẩu mới">
        <input className="field-input" type="password" />
      </Field>
      <Field label="Nhập lại mật khẩu mới">
        <input className="field-input" type="password" />
      </Field>
      <div className="flex justify-end">
        <button onClick={onClose} className="rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900" type="button">
          Đổi mật khẩu
        </button>
      </div>
    </div>
  )
}

function CompanyManagement({ brands }: { brands: BrandRecord[] }) {
  const [companies, setCompanies] = useState<Array<{ id: string; code: string; name: string }>>(() =>
    COMPANY_ORDER.map((company) => ({
      id: company,
      code: company,
      name: COMPANY_LABEL[company],
    })),
  )
  const [newCompanyCode, setNewCompanyCode] = useState('')
  const [newCompanyName, setNewCompanyName] = useState('')

  const updateCompany = (id: string, patch: Partial<{ code: string; name: string }>) => {
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
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[120px_1fr_auto]">
        <input
          value={newCompanyCode}
          onChange={(event) => setNewCompanyCode(event.target.value)}
          className="field-input"
          placeholder="Mã"
        />
        <input
          value={newCompanyName}
          onChange={(event) => setNewCompanyName(event.target.value)}
          className="field-input"
          placeholder="Tên pháp nhân"
        />
        <button
          onClick={addCompany}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900"
          type="button"
        >
          <Plus size={15} />
          Thêm
        </button>
      </div>
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
                  <span className="mr-3">
                    {brands.filter((brand) => brand.company === company.code).length}
                  </span>
                  <button
                    onClick={() => setCompanies((current) => current.filter((item) => item.id !== company.id))}
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
      <p className="mt-3 text-[11.5px] text-muted">
        Thêm/sửa/xóa trong popup là demo cục bộ cho danh mục. Khi có backend thật, CRUD pháp nhân nên đi qua API riêng.
      </p>
    </div>
  )
}

function AgencyManagement({ brands }: { brands: BrandRecord[] }) {
  const [agencies, setAgencies] = useState(() =>
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
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-cream/70 p-3 sm:grid-cols-[1fr_auto]">
        <input
          value={newAgencyName}
          onChange={(event) => setNewAgencyName(event.target.value)}
          className="field-input"
          placeholder="Tên đơn vị đại diện SHTT"
        />
        <button
          onClick={addAgency}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brown-800 px-3 py-2 text-xs font-bold text-white hover:bg-brown-900"
          type="button"
        >
          <Plus size={15} />
          Thêm
        </button>
      </div>
      <div className="space-y-2">
        {agencies.map((agency) => (
          <div
            key={agency.id}
            className="grid items-center gap-2 rounded-xl border border-border bg-cream/70 px-4 py-3 text-[12.5px] sm:grid-cols-[1fr_auto_auto]"
          >
            <input
              value={agency.name}
              onChange={(event) =>
                setAgencies((current) =>
                  current.map((item) =>
                    item.id === agency.id ? { ...item, name: event.target.value } : item,
                  ),
                )
              }
              className="field-input font-semibold text-brown-800"
            />
            <span className="rounded-full bg-brown-800 px-2.5 py-0.5 text-[11.5px] font-bold text-white">
              {brands.filter((brand) => (brand.agency || 'Chưa xác định') === agency.name).length}
            </span>
            <button
              onClick={() => setAgencies((current) => current.filter((item) => item.id !== agency.id))}
              className="inline-flex items-center justify-center gap-1 rounded-md border border-status-red/35 px-2 py-1 text-[11px] font-bold text-status-red hover:bg-status-red-bg"
              type="button"
            >
              <Trash2 size={13} />
              Xóa
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-muted">
        Thêm/sửa/xóa trong popup là demo cục bộ cho danh mục. Khi có backend thật, quản lý đại diện SHTT nên tách thành API danh mục riêng.
      </p>
    </div>
  )
}
