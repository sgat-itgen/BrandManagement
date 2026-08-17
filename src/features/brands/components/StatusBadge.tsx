import { STATUS_META } from '../mocks'
import type { BrandStatus } from '../types'

export function StatusBadge({ status }: { status: BrandStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${STATUS_META[status].tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_META[status].shortLabel}
    </span>
  )
}
