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
  const brand = modal?.mode === 'detail' ? brands.find((item) => item.id === modal.brandId) : null

  if (!modal) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brown-900/45 p-5" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-160 overflow-y-auto rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,.3)]" onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 flex items-start justify-between gap-3 rounded-t-2xl border-b border-border bg-white px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-brown-900">
              {modal.mode === 'add' ? 'Thêm thương hiệu mới' : modal.mode === 'password' ? 'Đổi mật khẩu' : brand?.mark}
            </h2>
            <p className="mt-1 text-xs text-muted">
              {modal.mode === 'add'
                ? COMPANY_LABEL[modal.company]
                : modal.mode === 'password'
                  ? 'Mô phỏng form đổi mật khẩu theo prototype'
                  : brand
                    ? `${COMPANY_LABEL[brand.company]} · Nhóm ${compact(brand.groups)}`
                    : ''}
            </p>
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
      </div>
    </div>
  )
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

      <div className="mt-4 flex items-center justify-between">
        {brand.isCustom ? (
          <button
            onClick={async () => {
              await mutations.deleteBrand.mutateAsync(brand.id)
              onClose()
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-status-red/35 px-3 py-2 text-xs font-semibold text-status-red hover:bg-status-red-bg"
            type="button"
          >
            <Trash2 size={15} />
            Xóa vĩnh viễn
          </button>
        ) : (
          <span />
        )}
        <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900" type="button">
          <Save size={16} />
          Lưu thay đổi
        </button>
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
