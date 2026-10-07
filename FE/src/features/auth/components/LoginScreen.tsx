import { useState, type FormEvent } from 'react'
import { useLogin } from '../hooks/useAuth'

export function LoginScreen() {
  const loginMutation = useLogin()
  const [loginError, setLoginError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError('')

    try {
      await loginMutation.mutateAsync({ email, password })
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Đăng nhập thất bại')
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-br from-brown-900 to-brown-700 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-95 rounded-[18px] bg-white px-8 py-9 shadow-[0_20px_60px_rgba(0,0,0,.35)]"
      >
        <img className="mx-auto h-14 object-contain" src="/logo-sgat.png" alt="Sài Gòn An Thái" />
        <h1 className="mt-4 text-center text-base font-extrabold text-brown-900">
          DASHBOARD QUẢN LÝ NHÃN HIỆU
        </h1>
        <p className="mb-5 mt-1 text-center text-xs text-muted">
          Tập đoàn An Thái · Đăng nhập để tiếp tục
        </p>
        {loginError ? (
          <div className="mb-3 rounded-lg border border-status-red/35 bg-status-red-bg px-3 py-2 text-xs font-semibold text-status-red">
            {loginError}
          </div>
        ) : null}
        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wide text-brown-700">
          Email
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-3 w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-gold-light"
          autoComplete="username"
        />
        <label className="mb-1 block text-[11.5px] font-bold uppercase tracking-wide text-brown-700">
          Mật khẩu
        </label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-gold-light"
          type="password"
          autoComplete="current-password"
        />
        <button
          className="w-full rounded-lg bg-brown-800 px-3 py-2.5 text-[13.5px] font-bold text-white hover:bg-brown-900 disabled:opacity-70"
          disabled={loginMutation.isPending}
          type="submit"
        >
          {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  )
}
//notesomthing