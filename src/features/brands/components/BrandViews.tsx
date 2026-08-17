import { FileText, Plus } from 'lucide-react'
import { COMPANY_LABEL, COMPANY_ORDER } from '../mocks'
import type { CompanyCode, BrandRecord } from '../types'
import { compact } from '../utils'
import { StatusBadge } from './StatusBadge'

export type ModalIntent =
  | { mode: 'detail'; brandId: number }
  | { mode: 'add'; company: CompanyCode }
  | { mode: 'password' }

export function CardView({
  groups,
  onAdd,
  onOpen,
}: {
  groups: Record<CompanyCode, BrandRecord[]>
  onAdd: (modal: ModalIntent) => void
  onOpen: (brandId: number) => void
}) {
  return (
    <section className="space-y-6">
      {COMPANY_ORDER.map((company) => (
        <div key={company}>
          <div className="mb-3 flex items-center gap-2.5 rounded-[10px] bg-brown-800 px-4 py-2.5 text-[13px] font-bold text-white">
            <span>{COMPANY_LABEL[company]}</span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11.5px]">{groups[company].length}</span>
            <button
              onClick={() => onAdd({ mode: 'add', company })}
              className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[11.5px] font-bold hover:bg-white/25"
              type="button"
            >
              <Plus size={13} />
              Thêm nhãn hiệu
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {groups[company].map((brand) => (
              <BrandCard key={brand.id} brand={brand} onOpen={onOpen} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function BrandCard({ brand, onOpen }: { brand: BrandRecord; onOpen: (brandId: number) => void }) {
  return (
    <button
      onClick={() => onOpen(brand.id)}
      className="relative rounded-xl border border-border bg-white p-3.5 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-gold-light"
      type="button"
    >
      {brand.assumption ? <span className="absolute right-2 top-2 text-sm">⚠</span> : null}
      {brand.logo ? (
        <img src={brand.logo} alt="" className="mb-2 h-22 w-full rounded-lg border border-border bg-cream object-contain" />
      ) : (
        <div className="mb-2 grid h-22 place-items-center rounded-lg border border-dashed border-border bg-cream text-center text-[11px] text-muted">
          <span>Chưa có ảnh logo</span>
        </div>
      )}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-[13.5px] font-bold leading-snug text-brown-900">{brand.mark}</h3>
        <StatusBadge status={brand.status} />
      </div>
      <p className="text-[11.5px] text-muted">
        <b className="text-brown-700">Nhóm:</b> {compact(brand.groups)}
      </p>
      <p className="text-[11.5px] text-muted">
        <b className="text-brown-700">Đơn:</b> {compact(brand.appNo)}
      </p>
      <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-2">
        <span className="rounded-md bg-cream px-2 py-0.5 text-[10.5px] font-semibold text-brown-700">
          {compact(brand.type)}
        </span>
        <span className="text-[11px] font-bold text-gold">
          {brand.attachments.length ? `📎 ${brand.attachments.length}` : '—'}
        </span>
      </div>
    </button>
  )
}

export function TableView({ brands, onOpen }: { brands: BrandRecord[]; onOpen: (brandId: number) => void }) {
  return (
    <div className="overflow-auto rounded-[14px] border border-border bg-white shadow-soft">
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr className="bg-brown-800 text-left text-[11px] uppercase tracking-wide text-white">
            {['Logo', 'Pháp nhân', 'Nhãn hiệu', 'Loại', 'Nhóm', 'Đơn / Bằng', 'Ngày', 'Trạng thái', 'Đại diện', 'Đính kèm'].map((head) => (
              <th key={head} className="whitespace-nowrap px-3 py-3 font-bold">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} onClick={() => onOpen(brand.id)} className="cursor-pointer border-b border-border hover:bg-[#FBF7EF]">
              <td className="px-3 py-2">
                {brand.logo ? (
                  <img src={brand.logo} alt="" className="h-11 w-11 rounded-md border border-border bg-cream object-contain" />
                ) : (
                  <div className="grid h-11 w-11 place-items-center rounded-md border border-dashed border-border bg-cream text-gold">
                    <FileText size={16} />
                  </div>
                )}
              </td>
              <td className="px-3 py-2 font-semibold text-brown-800">{COMPANY_LABEL[brand.company]}</td>
              <td className="px-3 py-2">
                <div className="font-bold text-brown-900">{brand.mark}</div>
                <div className="text-[11px] text-muted">{brand.detail}</div>
              </td>
              <td className="px-3 py-2">{compact(brand.type)}</td>
              <td className="px-3 py-2">{compact(brand.groups)}</td>
              <td className="px-3 py-2">
                <div>{compact(brand.appNo)}</div>
                <div className="text-[11px] text-muted">VB: {compact(brand.certNo)}</div>
              </td>
              <td className="px-3 py-2">
                <div>Nộp: {compact(brand.filedDate)}</div>
                <div className="text-[11px] text-muted">Hạn: {compact(brand.expiryDate)}</div>
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={brand.status} />
              </td>
              <td className="px-3 py-2">{brand.agency || <span className="text-muted">Chưa xác định</span>}</td>
              <td className="px-3 py-2">{brand.attachments.length ? `📎 ${brand.attachments.length}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
