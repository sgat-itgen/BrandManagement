import type { User } from './types'
import { ApiError, apiRequest } from '../../shared/api/client'

export async function login(email: string, password: string): Promise<User> {
  if (!email.trim() || !password.trim()) {
    throw new Error('Thiếu email hoặc mật khẩu')
  }

  return apiRequest<User>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), password }),
  })
}

export async function logout() {
  return apiRequest<void>('/api/auth/logout', { method: 'POST' })
}

export function changePassword(input: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) {
  return apiRequest<void>('/api/auth/password', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiRequest<User>('/api/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
