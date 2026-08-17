import { Field } from '../../../../shared/ui'

export function PasswordForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-3 px-6 py-5">
      <Field label="Mật khẩu hiện tại">
        <input className="field-input" type="password" />
      </Field>
      <Field label="Mật khẩu mới">
        <input className="field-input" type="password" />
      </Field>
      <Field label="Nhập lại mật khẩu mới">
        <input className="field-input" type="password" />
      </Field>
      <div className="flex justify-end">
        <button onClick={onClose} className="rounded-lg bg-brown-800 px-4 py-2 text-sm font-bold text-white hover:bg-brown-900" type="button">
          Đổi mật khẩu
        </button>
      </div>
    </div>
  )
}
