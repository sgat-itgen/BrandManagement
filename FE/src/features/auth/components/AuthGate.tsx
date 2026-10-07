import type { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useAuth'
import type { User } from '../types'

export function AuthGate({
  children,
  fallback,
}: {
  children: (user: User) => ReactNode
  fallback: ReactNode
}) {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <main className="grid min-h-screen place-items-center bg-cream px-5 text-sm text-muted">Đang kiểm tra phiên đăng nhập...</main>
  }

  if (isError || !user) {
    return fallback
  }

  return children(user)
}
