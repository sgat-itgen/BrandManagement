import type { ReactNode } from 'react'

export function Panel({ children, title }: { children: ReactNode; title: string }) {
  return (
    <article className="rounded-[14px] border border-border bg-white p-5 shadow-soft">
      <h2 className="mb-3.5 text-[12.5px] font-bold uppercase tracking-wide text-brown-700">{title}</h2>
      {children}
    </article>
  )
}
