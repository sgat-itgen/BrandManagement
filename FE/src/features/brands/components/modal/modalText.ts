import { COMPANY_LABEL } from '../../mocks'
import type { BrandRecord } from '../../types'
import { compact } from '../../utils'
import type { ModalState } from './types'

export function getModalTitle(modal: Exclude<ModalState, null>, brand: BrandRecord | null) {
  if (modal.mode === 'add') return 'Thêm thương hiệu mới'
  if (modal.mode === 'password') return 'Đổi mật khẩu'
  if (modal.mode === 'manage-companies') return 'Quản lý pháp nhân'
  if (modal.mode === 'manage-agencies') return 'Quản lý đại diện SHTT'
  return brand?.mark ?? 'Chi tiết nhãn hiệu'
}

export function getModalSubtitle(
  modal: Exclude<ModalState, null>,
  brand: BrandRecord | null,
  companyLabels: Record<string, string> = COMPANY_LABEL,
) {
  if (modal.mode === 'add') return companyLabels[modal.company] ?? modal.company
  if (modal.mode === 'password') return 'Cập nhật mật khẩu đăng nhập của tài khoản hiện tại'
  if (modal.mode === 'manage-companies') return 'Danh mục pháp nhân đang có hồ sơ nhãn hiệu'
  if (modal.mode === 'manage-agencies') return 'Danh mục đơn vị đại diện SHTT theo dữ liệu hiện tại'
  return brand ? `${companyLabels[brand.company] ?? brand.company} · Nhóm ${compact(brand.groups)}` : ''
}
