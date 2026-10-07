import { apiRequest, apiUrl } from '../../shared/api/client'
import type { BrandPatch, BrandRecord, BrandStatus, NewBrandInput } from './types'

interface ApiFile {
  id: number | null
  kind: string
  name: string
  url: string | null
  type: string
  size: number
  primary: boolean
}

interface ApiApplication {
  applicationNo: string
  filedDate: string | null
  rawFiledDate: string | null
  certificates: Array<{
    certificateNo: string | null
    issueDate: string | null
    expiryDate: string | null
    rawExpiryDate: string | null
  }>
}

interface ApiTrademark {
  id: number
  company: { code: string }
  mark: string
  type: string
  status: string
  statusDetail: string | null
  agency: { id: number; name: string } | null
  note: string | null
  groups: number[]
  applications: ApiApplication[]
  attachments: ApiFile[]
  dataOrigin: string
  verificationStatus: string
  verificationNote: string | null
  updatedAt: string
}

const statusValues: BrandStatus[] = ['granted', 'expired', 'pending', 'rejected']

function mapStatus(status: string): BrandStatus {
  return statusValues.includes(status as BrandStatus) ? (status as BrandStatus) : 'pending'
}

function displayDate(date: string | null | undefined, raw: string | null | undefined) {
  if (raw?.trim()) return raw
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return year && month && day ? `${day}/${month}/${year}` : date
}

function toApiDate(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (!match) return undefined
  const [, day, month, year] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function rawDate(value: string) {
  const trimmed = value.trim()
  return trimmed && !toApiDate(trimmed) ? trimmed : undefined
}

function firstApplication(record: ApiTrademark) {
  return record.applications[0]
}

function firstCertificate(record: ApiTrademark) {
  return firstApplication(record)?.certificates[0]
}

function mapAttachment(file: ApiFile) {
  return {
    id: file.id ?? 0,
    kind: file.kind,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    url: file.url ? apiUrl(file.url) : '',
  }
}

function mapTrademark(record: ApiTrademark): BrandRecord {
  const application = firstApplication(record)
  const certificate = firstCertificate(record)
  const attachments = record.attachments.map(mapAttachment)
  const logo = attachments.find((attachment) => attachment.kind === 'logo')?.url ?? ''

  return {
    id: record.id,
    company: record.company.code as BrandRecord['company'],
    mark: record.mark,
    type: record.type,
    groups: record.groups.join(', '),
    appNo: record.applications.map((item) => item.applicationNo).join(', '),
    certNo: record.applications
      .flatMap((item) => item.certificates)
      .map((item) => item.certificateNo)
      .filter(Boolean)
      .join(', '),
    filedDate: displayDate(application?.filedDate, application?.rawFiledDate),
    expiryDate: displayDate(certificate?.expiryDate, certificate?.rawExpiryDate),
    detail: record.statusDetail ?? '',
    status: mapStatus(record.status),
    agency: record.agency?.name ?? '',
    agencyId: record.agency?.id,
    note: record.note ?? '',
    logo,
    isCustom: record.dataOrigin === 'manual',
    assumption: false,
    assumptionNote: record.verificationNote ?? '',
    attachments,
    updatedAt: record.updatedAt,
  }
}

export async function fetchBrands() {
  const records = await apiRequest<ApiTrademark[]>('/api/trademarks')
  return records.map(mapTrademark)
}

export async function fetchBrand(id: number) {
  const record = await apiRequest<ApiTrademark>(`/api/trademarks/${id}`)
  return mapTrademark(record)
}

function groupsFromInput(groups: string) {
  return [...new Set((groups.match(/\d+/g) ?? []).map(Number).filter((value) => value > 0))]
}

function toCreateRequest(input: NewBrandInput) {
  const filedDate = toApiDate(input.filedDate)
  const expiryDate = toApiDate(input.expiryDate)

  return {
    companyCode: input.company,
    markName: input.mark.trim(),
    markType: input.type.trim() || 'text',
    status: input.status,
    statusDetail: undefined,
    note: input.note.trim() || undefined,
    classNumbers: groupsFromInput(input.groups),
    applicationNo: input.appNo.trim() || undefined,
    filedDate,
    rawFiledDate: rawDate(input.filedDate),
    certificateNo: input.certNo.trim() || undefined,
    expiryDate,
    rawExpiryDate: rawDate(input.expiryDate),
  }
}

export async function updateBrand({ id, patch }: { id: number; patch: BrandPatch }) {
  const payload: Record<string, unknown> = {
    status: patch.status,
    note: patch.note.trim() || undefined,
    expiryDate: toApiDate(patch.expiryDate),
    rawExpiryDate: rawDate(patch.expiryDate),
  }

  if (patch.agencyId != null) payload.agencyId = patch.agencyId

  if (patch.agency.trim() && patch.agencyId == null) {
    const agencies = await apiRequest<Array<{ id: number; name: string }>>('/api/agencies')
    const agency = agencies.find((item) => item.name.trim().toLowerCase() === patch.agency.trim().toLowerCase())
    if (agency) payload.agencyId = agency.id
  }

  const record = await apiRequest<ApiTrademark>(`/api/trademarks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return mapTrademark(record)
}

export async function createBrand(input: NewBrandInput) {
  const record = await apiRequest<ApiTrademark>('/api/trademarks', {
    method: 'POST',
    body: JSON.stringify(toCreateRequest(input)),
  })
  return mapTrademark(record)
}

export function deleteBrand(id: number) {
  return apiRequest<void>(`/api/trademarks/${id}`, { method: 'DELETE' })
}

export async function updateBrandLogo(id: number, file: File | null) {
  if (!file) {
    const brand = await fetchBrand(id)
    const logo = brand.attachments.find((attachment) => attachment.kind === 'logo')
    if (logo) await apiRequest<void>(`/api/trademarks/${id}/files/${logo.id}`, { method: 'DELETE' })
    return { ok: true, logo: '' }
  }

  const formData = new FormData()
  formData.append('file', file)
  await apiRequest<ApiFile>(`/api/trademarks/${id}/logo`, {
    method: 'POST',
    body: formData,
  })
  const updated = await fetchBrand(id)
  return { ok: true, logo: updated.logo }
}

export async function addAttachments(id: number, files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  await apiRequest<ApiFile[]>(`/api/trademarks/${id}/attachments`, {
    method: 'POST',
    body: formData,
  })
  const updated = await fetchBrand(id)
  return updated.attachments
}

export function removeAttachment({ brandId, attachmentId }: { brandId: number; attachmentId: number }) {
  return apiRequest<void>(`/api/trademarks/${brandId}/files/${attachmentId}`, { method: 'DELETE' })
}
