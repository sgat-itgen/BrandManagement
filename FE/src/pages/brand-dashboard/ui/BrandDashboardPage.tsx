import { AuthGate } from '../../../features/auth/components/AuthGate'
import { LoginScreen } from '../../../features/auth/components/LoginScreen'
import { useLogout } from '../../../features/auth/hooks/useAuth'
import { BrandDashboardContent } from './BrandDashboardContent'

export function BrandDashboardPage() {
  const logoutMutation = useLogout()

  return (
    <AuthGate fallback={<LoginScreen />}>
      {(user) => (
        <BrandDashboardContent
          userLabel={`${user.name} · ${user.email}`}
          onLogout={() => void logoutMutation.mutateAsync()}
          isLoggingOut={logoutMutation.isPending}
        />
      )}
    </AuthGate>
  )
}
