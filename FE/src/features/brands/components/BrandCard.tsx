import type { BrandRecord } from '../types'
import { compact } from '../utils'
import { StatusBadge } from './StatusBadge'

export function BrandCard({
  brand,
  onOpen,
}: {
  brand: BrandRecord
  onOpen: (brandId: number) => void
}) {
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
      <div className="mb-2 flex items-start justify-between">
        <h3 className="line-clamp-2 text-[13.5px] font-bold leading-snug text-brown-900">{brand.mark}</h3>
      </div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-[12px] text-muted"><b className="text-brown-700">Trạng thái: </b></p>
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
