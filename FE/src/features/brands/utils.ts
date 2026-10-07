import { COMPANY_LABEL, STATUS_META } from './mocks'
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
  const byCompany: Record<CompanyCode, number> = {}
  const byAgency: Record<string, number> = {}

  brands.forEach((brand) => {
    byStatus[brand.status] += 1
    byCompany[brand.company] = (byCompany[brand.company] ?? 0) + 1
    byAgency[brand.agency] = (byAgency[brand.agency] ?? 0) + 1
  })

  return { total: brands.length, byStatus, byCompany, byAgency }
}

export function groupByCompany(brands: BrandRecord[]) {
  const groups: Record<CompanyCode, BrandRecord[]> = {}
  brands.forEach((brand) => {
    groups[brand.company] ??= []
    groups[brand.company].push(brand)
  })
  return groups
}

export function getRenewalReviewItems(brands: BrandRecord[], windowDays = 180) {
  const today = startOfDay(new Date())
  const windowEnd = addDays(today, windowDays)

  const realItems = brands
    .map((brand) => {
      const expiry = parseDisplayDate(brand.expiryDate)
      if (!expiry) return null

      const normalizedExpiry = startOfDay(expiry)
      const daysUntilExpiry = differenceInDays(normalizedExpiry, today)

      return {
        brand,
        daysUntilExpiry,
        expiry: normalizedExpiry,
        displayExpiryDate: brand.expiryDate,
        isDemo: false,
      }
    })
    .filter((item): item is NonNullable<typeof item> => {
      if (!item) return false
      return (
        item.brand.status === 'granted' &&
        item.expiry >= today &&
        item.expiry <= windowEnd
      )
    })
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  if (realItems.length) return realItems

  return getDemoRenewalItems(brands, today)
}

export function exportJSON(brands: BrandRecord[]) {
  downloadBlob(new Blob([JSON.stringify(brands, null, 2)], { type: 'application/json' }), `An_Thai_Brand_Dashboard_${todayStr()}.json`)
}

export function exportCSV(brands: BrandRecord[], companyLabels: Record<string, string> = COMPANY_LABEL) {
  const headers = ['ID', 'Pháp nhân', 'Nhãn hiệu', 'Loại', 'Nhóm', 'Số đơn', 'Số bằng', 'Ngày nộp', 'Ngày hết hạn', 'Trạng thái', 'Đại diện SHTT', 'Ghi chú']
  const rows = brands.map((brand) => [
    brand.id,
    companyLabels[brand.company] ?? brand.company,
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

function parseDisplayDate(value: string) {
  const trimmed = value.trim()
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (!match) return null

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function differenceInDays(left: Date, right: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.round((left.getTime() - right.getTime()) / millisecondsPerDay)
}

function getDemoRenewalItems(brands: BrandRecord[], today: Date) {
  const sourceMarks = new Set([
    'HiUp Coffee',
    'An Thái Café (chữ ký)',
    'Hình (yếu tố cờ Trung Quốc + biểu tượng ủng)',
  ])
  const demoOffsets = [35, 92, 148]

  return brands
    .filter((brand) => sourceMarks.has(brand.mark) && brand.expiryDate)
    .slice(0, demoOffsets.length)
    .map((brand, index) => {
      const daysUntilExpiry = demoOffsets[index]
      const expiry = addDays(today, daysUntilExpiry)

      return {
        brand,
        daysUntilExpiry,
        expiry,
        displayExpiryDate: formatDisplayDate(expiry),
        isDemo: true,
      }
    })
}

function formatDisplayDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
}
