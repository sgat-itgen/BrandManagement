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
  const { data: user } = useCurrentUser()

  if (!user) {
    return fallback
  }

  return children(user)
}
