import { Grid2X2, List, Search } from 'lucide-react'
import { STATUS_META } from '../mocks'
import { statusOrder, type Filters, type ViewMode } from '../constants'
import type { getFilterOptions } from '../utils'

type FilterOptions = ReturnType<typeof getFilterOptions>

export function BrandFilters({
  filters,
  options,
  companies,
  viewMode,
  onFiltersChange,
  onViewModeChange,
}: {
  filters: Filters
  options: FilterOptions
  companies: Array<{ code: string; label: string }>
  viewMode: ViewMode
  onFiltersChange: (filters: Filters) => void
  onViewModeChange: (mode: ViewMode) => void
}) {
  const update = (patch: Partial<Filters>) => onFiltersChange({ ...filters, ...patch })

  return (
    <section className="mb-4 flex flex-wrap items-center gap-2.5 rounded-[14px] border border-border bg-white p-4 shadow-soft">
      <label className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          className="w-full rounded-lg border border-border py-2.5 pl-9 pr-3 text-[12.5px] outline-none focus:border-gold-light"
          placeholder="Tìm theo tên nhãn hiệu, số đơn, số bằng..."
        />
      </label>
      <Select value={filters.company} onChange={(value) => update({ company: value as Filters['company'] })}>
        <option value="">Tất cả pháp nhân</option>
        {companies.map((company) => (
          <option key={company.code} value={company.code}>
            {company.label}
          </option>
        ))}
      </Select>
      <Select value={filters.status} onChange={(value) => update({ status: value as Filters['status'] })}>
        <option value="">Tất cả trạng thái</option>
        {statusOrder.map((status) => (
          <option key={status} value={status}>
            {STATUS_META[status].label}
          </option>
        ))}
      </Select>
      <Select value={filters.type} onChange={(value) => update({ type: value })}>
        <option value="">Tất cả loại</option>
        {options.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <Select value={filters.agency} onChange={(value) => update({ agency: value })}>
        <option value="">Tất cả đại diện</option>
        {options.agencies.map((agency) => (
          <option key={agency} value={agency}>
            {agency || 'Chưa xác định'}
          </option>
        ))}
      </Select>
      <div className="ml-auto inline-flex overflow-hidden rounded-lg border border-border">
        <ViewButton active={viewMode === 'card'} icon={<Grid2X2 size={15} />} onClick={() => onViewModeChange('card')}>
          Thẻ
        </ViewButton>
        <ViewButton active={viewMode === 'table'} icon={<List size={15} />} onClick={() => onViewModeChange('table')}>
          Bảng
        </ViewButton>
      </div>
    </section>
  )
}

function Select({
  children,
  onChange,
  value,
}: {
  children: React.ReactNode
  onChange: (value: string) => void
  value: string
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="min-w-38 rounded-lg border border-border bg-white px-3 py-2.5 text-[12.5px] outline-none focus:border-gold-light"
    >
      {children}
    </select>
  )
}

function ViewButton({
  active,
  children,
  icon,
  onClick,
}: {
  active: boolean
  children: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-[12.5px] font-semibold ${
        active ? 'bg-brown-800 text-white' : 'bg-white text-muted hover:bg-cream'
      }`}
      type="button"
    >
      {icon}
      {children}
    </button>
  )
}
