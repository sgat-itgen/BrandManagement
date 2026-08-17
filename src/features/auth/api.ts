import type { User } from './types'

let activeUser: User | null = null

const delay = <T,>(value: T, ms = 180) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })

export async function login(email: string, password: string): Promise<User> {
  if (!email.trim() || !password.trim()) {
    throw new Error('Thiếu email hoặc mật khẩu')
  }

  activeUser = {
    email: email.trim().toLowerCase(),
    name: 'Nhóm pháp chế An Thái',
    role: 'admin',
  }
  return delay(activeUser)
}

export async function logout() {
  activeUser = null
  return delay({ ok: true })
}

export async function getCurrentUser() {
  return delay(activeUser)
}
