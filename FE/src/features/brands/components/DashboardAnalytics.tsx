import { STATUS_META } from '../mocks'
import { chartColors, statusOrder } from '../constants'
import type { BrandRecord, BrandStatus } from '../types'
import type { getStats } from '../utils'
import { Panel } from '../../../shared/ui'

type Stats = ReturnType<typeof getStats>

export function KpiGrid({ stats }: { stats: Stats }) {
  const cards = [
    ['total', 'Tổng hồ sơ', stats.total, 'Toàn bộ pháp nhân', 'bg-brown-700'],
    ['granted', 'Cấp bằng', stats.byStatus.granted, 'Đang hiệu lực', 'bg-status-green'],
    ['expired', 'Hết hạn', stats.byStatus.expired, 'Cần rà soát gia hạn', 'bg-status-amber'],
    ['pending', 'Đang giải quyết', stats.byStatus.pending, 'Theo dõi tiến độ', 'bg-status-blue'],
    ['rejected', 'Từ chối', stats.byStatus.rejected, 'Không theo đuổi', 'bg-status-red'],
  ] as const

  return (
    <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(([key, label, value, sub, bar]) => (
        <article key={key} className="relative overflow-hidden rounded-[14px] border border-border bg-white p-4 shadow-soft">
          <div className={`absolute inset-y-0 left-0 w-1.5 ${bar}`} />
          <div className="text-[11.5px] font-bold uppercase tracking-wide text-muted">{label}</div>
          <div className="mt-1 text-3xl font-extrabold text-brown-900">{value}</div>
          <div className="mt-0.5 text-[11.5px] text-muted">{sub}</div>
        </article>
      ))}
    </section>
  )
}

export function AnalyticsRow({
  brands,
  stats,
  companies,
}: {
  brands: BrandRecord[]
  stats: Stats
  companies: Array<{ code: string; label: string }>
}) {
  const maxCompany = Math.max(...Object.values(stats.byCompany), 1)
  const agencies = Object.entries(stats.byAgency)
    .map(([agency, count]) => [agency || 'Chưa xác định', count] as const)
    .sort((a, b) => b[1] - a[1])

  return (
    <section className="mb-5 grid gap-3 xl:grid-cols-[1.1fr_1fr_1fr]">
      <Panel title="Phân bổ trạng thái">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Donut stats={stats.byStatus} total={brands.length} />
          <div className="flex flex-col gap-2 text-[12.5px]">
            {statusOrder.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: chartColors[status] }} />
                <span>{STATUS_META[status].label}</span>
                <b className="text-brown-900">{stats.byStatus[status]}</b>
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="Theo pháp nhân">
        <div className="space-y-2.5">
          {companies.map((company) => (
            <div key={company.code} className="flex items-center gap-3 text-[12.5px]">
              <span className="w-36 shrink-0 font-semibold text-brown-800">{company.label}</span>
              <div className="h-4 flex-1 overflow-hidden rounded-md bg-[#F1EBE0]">
                <div className="h-full bg-brown-700" style={{ width: `${((stats.byCompany[company.code] ?? 0) / maxCompany) * 100}%` }} />
              </div>
              <b className="w-7 text-right text-brown-900">{stats.byCompany[company.code] ?? 0}</b>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Theo đơn vị đại diện SHTT">
        <div>
          {agencies.map(([agency, count]) => (
            <div
              key={agency}
              className="flex items-center justify-between gap-3 border-b border-dashed border-border py-[7px] text-[12.5px] last:border-b-0"
            >
              <span className="font-semibold text-brown-800">{agency}</span>
              <span className="rounded-full bg-brown-800 px-2.5 py-0.5 text-[11.5px] font-bold text-white">
                {count}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  )
}

function Donut({ stats, total }: { stats: Record<BrandStatus, number>; total: number }) {
  const circumference = 2 * Math.PI * 52
  const segments = statusOrder.reduce<Array<{ dash: number; offset: number; status: BrandStatus }>>(
    (items, status) => {
      const ratio = total ? stats[status] / total : 0
      const previous = items.at(-1)
      const offset = previous ? previous.offset + (previous.dash / circumference) * 360 : 25
      return [...items, { status, dash: ratio * circumference, offset }]
    },
    [],
  )

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="Phân bổ trạng thái">
      <circle cx="70" cy="70" r="52" fill="none" stroke="#F1EBE0" strokeWidth="18" />
      {segments.map(({ dash, offset, status }) => (
        <circle
          key={status}
          cx="70"
          cy="70"
          r="52"
          fill="none"
          stroke={chartColors[status]}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="butt"
          strokeWidth="18"
          style={{ transform: `rotate(${offset}deg)`, transformOrigin: '70px 70px' }}
        />
      ))}
      <text x="70" y="66" textAnchor="middle" className="fill-brown-900 text-[26px] font-extrabold">
        {total}
      </text>
      <text x="70" y="84" textAnchor="middle" className="fill-muted text-[11px] font-bold uppercase">
        Hồ sơ
      </text>
    </svg>
  )
}
