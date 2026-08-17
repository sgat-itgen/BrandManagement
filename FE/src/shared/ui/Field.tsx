import type { ReactNode } from 'react'

export function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11.5px] font-bold uppercase tracking-wide text-brown-700">{label}</span>
      {children}
    </label>
  )
}
