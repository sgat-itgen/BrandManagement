import { Building2, Download, KeyRound, LogOut, Scale } from 'lucide-react'
import { ToolbarButton } from '../../../shared/ui'

export function DashboardHeader({
  onManageAgencies,
  onManageCompanies,
  onExportCSV,
  onExportJSON,
  onLogout,
  onOpenPassword,
  userLabel,
  isLoggingOut,
}: {
  onManageAgencies: () => void
  onManageCompanies: () => void
  onExportCSV: () => void
  onExportJSON: () => void
  onLogout: () => void
  onOpenPassword: () => void
  userLabel: string
  isLoggingOut: boolean
}) {
  return (
    <header className="mb-5 flex flex-col gap-4 rounded-[14px] border border-border bg-white px-5 py-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <img className="h-13 w-auto object-contain" src="/logo-sgat.png" alt="Sài Gòn An Thái" />
        <div className="min-w-0">
          <h1 className="text-base font-extrabold tracking-wide text-brown-900 sm:text-[19px]">
            DASHBOARD QUẢN LÝ NHÃN HIỆU (LOGO) — TẬP ĐOÀN AN THÁI
          </h1>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Theo dõi tình trạng bảo hộ thương hiệu theo từng pháp nhân
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-cream px-3 py-1.5 text-xs font-semibold text-brown-700">
          {userLabel}
        </span>
        <ToolbarButton icon={<Building2 size={15} />} onClick={onManageCompanies}>
          Quản lý pháp nhân
        </ToolbarButton>
        <ToolbarButton icon={<Scale size={15} />} onClick={onManageAgencies}>
          Quản lý đại diện SHTT
        </ToolbarButton>
        <ToolbarButton icon={<KeyRound size={15} />} onClick={onOpenPassword}>
          Đổi mật khẩu
        </ToolbarButton>
        <ToolbarButton icon={<Download size={15} />} onClick={onExportJSON}>
          JSON
        </ToolbarButton>
        <ToolbarButton icon={<Download size={15} />} onClick={onExportCSV}>
          CSV
        </ToolbarButton>
        <ToolbarButton danger icon={<LogOut size={15} />} onClick={onLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Đang thoát...' : 'Đăng xuất'}
        </ToolbarButton>
      </div>
    </header>
  )
}
