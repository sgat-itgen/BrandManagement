import { COMPANY_LABEL, COMPANY_ORDER, STATUS_META } from './mocks'
import { statusOrder, type Filters } from './constants'
import type { BrandRecord, BrandStatus, CompanyCode } from './types'

export const compact = (value: string) => value || '—'

export const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function filterBrands(brands: BrandRecord[], filters: Filters) {
  const search = filters.search.trim().toLowerCase()
  return brands.filter((brand) => {
    const searchTarget = `${brand.mark} ${brand.appNo} ${brand.certNo} ${brand.detail}`.toLowerCase()
    return (
      (!search || searchTarget.includes(search)) &&
      (!filters.company || brand.company === filters.company) &&
      (!filters.status || brand.status === filters.status) &&
      (!filters.type || brand.type === filters.type) &&
      (!filters.agency || brand.agency === filters.agency)
    )
  })
}

export function getFilterOptions(brands: BrandRecord[]) {
  return {
    types: [...new Set(brands.map((brand) => brand.type).filter(Boolean))].sort(),
    agencies: [...new Set(brands.map((brand) => brand.agency))].sort(),
  }
}

export function getStats(brands: BrandRecord[]) {
  const byStatus = Object.fromEntries(statusOrder.map((status) => [status, 0])) as Record<BrandStatus, number>
  const byCompany = Object.fromEntries(COMPANY_ORDER.map((company) => [company, 0])) as Record<CompanyCode, number>
  const byAgency: Record<string, number> = {}

  brands.forEach((brand) => {
    byStatus[brand.status] += 1
    byCompany[brand.company] += 1
    byAgency[brand.agency] = (byAgency[brand.agency] ?? 0) + 1
  })

  return { total: brands.length, byStatus, byCompany, byAgency }
}

export function groupByCompany(brands: BrandRecord[]) {
  const groups: Record<CompanyCode, BrandRecord[]> = {
    TNHH: [],
    SGAT: [],
    DTPT: [],
    SXTM: [],
  }
  brands.forEach((brand) => groups[brand.company].push(brand))
  return groups
}

export function exportJSON(brands: BrandRecord[]) {
  downloadBlob(new Blob([JSON.stringify(brands, null, 2)], { type: 'application/json' }), `An_Thai_Brand_Dashboard_${todayStr()}.json`)
}

export function exportCSV(brands: BrandRecord[]) {
  const headers = ['ID', 'Pháp nhân', 'Nhãn hiệu', 'Loại', 'Nhóm', 'Số đơn', 'Số bằng', 'Ngày nộp', 'Ngày hết hạn', 'Trạng thái', 'Đại diện SHTT', 'Ghi chú']
  const rows = brands.map((brand) => [
    brand.id,
    COMPANY_LABEL[brand.company],
    brand.mark,
    brand.type,
    brand.groups,
    brand.appNo,
    brand.certNo,
    brand.filedDate,
    brand.expiryDate,
    STATUS_META[brand.status].label,
    brand.agency,
    brand.note,
  ])
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }), `An_Thai_Brand_Dashboard_${todayStr()}.csv`)
}

function csvEscape(value: unknown) {
  const text = String(value ?? '')
  return text.includes(',') || text.includes('"') || text.includes('\n') ? `"${text.replace(/"/g, '""')}"` : text
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function todayStr() {
  const date = new Date()
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
}
