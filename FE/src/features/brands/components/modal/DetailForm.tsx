import { Paperclip, Save, Trash2, Upload, X } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { statusOrder } from '../../constants'
import type { useBrandMutations } from '../../hooks/useBrands'
import { STATUS_META } from '../../mocks'
import type { BrandRecord, BrandStatus } from '../../types'
import { compact, formatSize } from '../../utils'
import { Field } from '../../../../shared/ui'

export function DetailForm({
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

      <LogoEditor brand={brand} removeLogo={() => mutations.updateLogo.mutate({ id: brand.id, file: null })} uploadLogo={uploadLogo} />
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

      <DetailActions
        deleteBrand={async () => {
          await mutations.deleteBrand.mutateAsync(brand.id)
          onClose()
        }}
        onClose={onClose}
        save={save}
      />
    </div>
  )
}

function LogoEditor({
  brand,
  removeLogo,
  uploadLogo,
}: {
  brand: BrandRecord
  removeLogo: () => void
  uploadLogo: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
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
          onClick={removeLogo}
          type="button"
        >
          <Trash2 size={15} />
          Xóa ảnh logo
        </button>
      ) : null}
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

function DetailActions({
  deleteBrand,
  onClose,
  save,
}: {
  deleteBrand: () => Promise<void>
  onClose: () => void
  save: () => Promise<void>
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
      <button
        onClick={deleteBrand}
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
  )
}
