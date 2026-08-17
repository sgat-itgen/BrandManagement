import { useMemo, useState } from 'react'
import { emptyFilters, type Filters, type ViewMode } from '../../../features/brands/constants'
import { useBrands } from '../../../features/brands/hooks/useBrands'
import {
  exportCSV,
  exportJSON,
  filterBrands,
  getFilterOptions,
  getRenewalReviewItems,
  getStats,
  groupByCompany,
} from '../../../features/brands/utils'
import { AnalyticsRow, KpiGrid } from '../../../features/brands/components/DashboardAnalytics'
import { BrandFilters } from '../../../features/brands/components/BrandFilters'
import { BrandModal, type ModalState } from '../../../features/brands/components/BrandModal'
import { CardView, TableView } from '../../../features/brands/components/BrandViews'
import { DashboardHeader } from '../../../features/brands/components/DashboardHeader'
import { RenewalReviewSection } from '../../../features/brands/components/RenewalReviewSection'

export function BrandDashboardContent({
  userLabel,
  onLogout,
}: {
  userLabel: string
  onLogout: () => void
}) {
  const { data: brands = [], isLoading } = useBrands()
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [modal, setModal] = useState<ModalState>(null)

  const filtered = useMemo(() => filterBrands(brands, filters), [brands, filters])
  const options = useMemo(() => getFilterOptions(brands), [brands])
  const stats = useMemo(() => getStats(brands), [brands])
  const companyGroups = useMemo(() => groupByCompany(filtered), [filtered])
  const renewalReviewItems = useMemo(() => getRenewalReviewItems(brands), [brands])

  return (
    <main className="min-h-screen bg-cream text-sm text-brand-text">
      <div className="mx-auto max-w-360 px-5 py-5 lg:px-7 lg:pb-16">
        <DashboardHeader
          userLabel={userLabel}
          onLogout={onLogout}
          onOpenPassword={() => setModal({ mode: 'password' })}
          onExportJSON={() => exportJSON(brands)}
          onExportCSV={() => exportCSV(brands)}
          onManageCompanies={() => setModal({ mode: 'manage-companies' })}
          onManageAgencies={() => setModal({ mode: 'manage-agencies' })}
        />

        <KpiGrid stats={stats} />
        <AnalyticsRow brands={brands} stats={stats} />
        <RenewalReviewSection
          items={renewalReviewItems}
          onOpenBrand={(brandId) => setModal({ mode: 'detail', brandId })}
        />

        <BrandFilters
          filters={filters}
          options={options}
          viewMode={viewMode}
          onFiltersChange={setFilters}
          onViewModeChange={setViewMode}
        />

        <p className="mb-3 ml-1 text-xs text-muted">
          {isLoading ? 'Đang tải dữ liệu...' : `Hiển thị ${filtered.length} / ${brands.length} hồ sơ`}
        </p>

        {viewMode === 'card' ? (
          <CardView
            groups={companyGroups}
            onAdd={setModal}
            onOpen={(brandId) => setModal({ mode: 'detail', brandId })}
          />
        ) : (
          <TableView brands={filtered} onOpen={(brandId) => setModal({ mode: 'detail', brandId })} />
        )}

        <footer className="mt-7 rounded-xl border border-border bg-white px-5 py-4 text-[11.5px] leading-relaxed text-muted">
          <b className="text-brown-800">Ghi chú dữ liệu:</b> Dữ liệu được trích xuất từ file{' '}
          <b className="text-brown-800">ATG - Allbrand.pdf</b>. Có 2 điểm cần xác nhận thêm: nhóm từ chối
          của CTY TNHH An Thái và đơn vị đại diện của một số hồ sơ Instant Coffee / HiUp Coffee.
        </footer>
      </div>

      <BrandModal modal={modal} brands={brands} onClose={() => setModal(null)} />
    </main>
  )
}
