import type { ReactNode } from 'react'

export function ToolbarButton({
  children,
  danger,
  icon,
  onClick,
  disabled = false,
}: {
  children: string
  danger?: boolean
  icon: ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
        danger
          ? 'border-status-red/35 text-status-red hover:bg-status-red-bg'
          : 'border-border text-brown-800 hover:border-gold-light hover:bg-cream'
      } disabled:cursor-not-allowed disabled:opacity-50`}
      type="button"
    >
      {icon}
      {children}
    </button>
  )
}
