import { useState, type FormEvent } from 'react'
import { Field } from '../../../../shared/ui'
import { useChangePassword } from '../../../auth/hooks/useAuth'

export function PasswordForm({ onClose }: { onClose: () => void }) {
  const changePasswordMutation = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới không khớp')
      return
    }
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword, confirmPassword })
      onClose()
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Không thể đổi mật khẩu')
    }
  }

  return (
    <form className="space-y-3 px-4 py-5 sm:px-6" onSubmit={submit}>
      {error ? <p className="rounded-lg border border-status-red/35 bg-status-red-bg px-3 py-2 text-xs font-semibold text-status-red">{error}</p> : null}
      <Field label="Mật khẩu hiện tại">
        <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="field-input" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="Mật khẩu mới">
        <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="field-input" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Field label="Nhập lại mật khẩu mới">
        <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="field-input" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <div className="flex justify-end">
        <button disabled={changePasswordMutation.isPending} className="rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900 disabled:cursor-not-allowed disabled:opacity-60" type="submit">
          {changePasswordMutation.isPending ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </div>
    </form>
  )
}
