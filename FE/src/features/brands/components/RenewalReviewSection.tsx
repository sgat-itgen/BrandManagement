import { CalendarClock } from 'lucide-react'
import { STATUS_META } from '../mocks'
import type { getRenewalReviewItems } from '../utils'
import { compact } from '../utils'
import { Panel } from '../../../shared/ui'
import { StatusBadge } from './StatusBadge'

type RenewalItems = ReturnType<typeof getRenewalReviewItems>

export function RenewalReviewSection({
  items,
  companyLabels,
  windowDays = 180,
  onOpenBrand,
}: {
  items: RenewalItems
  companyLabels: Record<string, string>
  windowDays?: number
  onOpenBrand: (brandId: number) => void
}) {
  return (
    <section className="mb-5">
      <Panel title={`Rà soát gia hạn trong ${windowDays} ngày tới`}>
        {items.length ? (
          <div className="grid gap-2 lg:grid-cols-2">
            {items.map(({ brand, daysUntilExpiry, displayExpiryDate, isDemo }) => (
              <button
                key={brand.id}
                onClick={() => onOpenBrand(brand.id)}
                className="flex items-start gap-3 rounded-xl border border-border bg-cream/70 p-3 text-left transition hover:border-gold-light hover:bg-cream"
                type="button"
              >
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-status-amber-bg text-status-amber">
                  <CalendarClock size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-brown-900">{brand.mark}</span>
                  <span className="mt-1 block text-[11.5px] text-muted">
                    {companyLabels[brand.company] ?? brand.company} · Nhóm {compact(brand.groups)} · Hết hạn {displayExpiryDate}
                  </span>
                  <span className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={brand.status} />
                    {isDemo ? (
                      <span className="rounded-full border border-border bg-white px-2.5 py-1 text-[11px] font-bold text-brown-700">
                        Demo từ dữ liệu cũ
                      </span>
                    ) : null}
                    <span className="rounded-full border border-status-amber/35 bg-white px-2.5 py-1 text-[11px] font-bold text-status-amber">
                      Còn {daysUntilExpiry} ngày
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-cream/70 px-4 py-4 text-[12.5px] text-muted">
            <CalendarClock size={18} className="text-status-amber" />
            Không có hồ sơ {STATUS_META.granted.shortLabel.toLowerCase()} đến hạn gia hạn trong {windowDays} ngày tới.
          </div>
        )}
      </Panel>
    </section>
  )
}
