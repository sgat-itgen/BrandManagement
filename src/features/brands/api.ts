import { mockBrands } from './mocks'
import type { BrandPatch, BrandRecord, NewBrandInput } from './types'

let brands: BrandRecord[] = structuredClone(mockBrands)
let nextId = brands.length + 1
let nextAttachmentId = 1

const delay = <T,>(value: T, ms = 180) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

const cloneBrands = () => structuredClone(brands)

export async function fetchBrands() {
  return delay(cloneBrands())
}

export async function updateBrand({ id, patch }: { id: number; patch: BrandPatch }) {
  brands = brands.map((brand) =>
    brand.id === id ? { ...brand, ...patch, updatedAt: new Date().toISOString() } : brand,
  )
  return delay(brands.find((brand) => brand.id === id))
}

export async function createBrand(input: NewBrandInput) {
  const record: BrandRecord = {
    ...input,
    id: nextId,
    detail: '',
    logo: '',
    isCustom: true,
    assumption: false,
    assumptionNote: '',
    attachments: [],
    updatedAt: new Date().toISOString(),
  }
  nextId += 1
  brands = [...brands, record]
  return delay(structuredClone(record))
}

export async function deleteBrand(id: number) {
  const target = brands.find((brand) => brand.id === id)
  if (!target?.isCustom) {
    throw new Error('Chỉ có thể xóa thương hiệu tự thêm')
  }
  brands = brands.filter((brand) => brand.id !== id)
  return delay({ ok: true })
}

export async function updateBrandLogo(id: number, file: File | null) {
  const logo = file ? URL.createObjectURL(file) : ''
  brands = brands.map((brand) =>
    brand.id === id ? { ...brand, logo, updatedAt: new Date().toISOString() } : brand,
  )
  return delay({ ok: true, logo })
}

export async function addAttachments(id: number, files: File[]) {
  const attachments = files.map((file) => ({
    id: nextAttachmentId++,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    url: URL.createObjectURL(file),
  }))

  brands = brands.map((brand) =>
    brand.id === id
      ? { ...brand, attachments: [...brand.attachments, ...attachments] }
      : brand,
  )
  return delay(attachments)
}

export async function removeAttachment(attachmentId: number) {
  brands = brands.map((brand) => ({
    ...brand,
    attachments: brand.attachments.filter((attachment) => attachment.id !== attachmentId),
  }))
  return delay({ ok: true })
}
