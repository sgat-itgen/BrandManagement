export class ApiError extends Error {
  readonly status: number

  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '')

export function apiUrl(path: string) {
  return path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

function getErrorMessage(body: unknown, fallback: string) {
  if (typeof body === 'string' && body.trim()) return body
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const isFormData = init.body instanceof FormData

  if (init.body !== undefined && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: 'include',
  })

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? ''
    const body = contentType.includes('application/json')
      ? await response.json().catch(() => undefined)
      : await response.text().catch(() => '')
    throw new ApiError(getErrorMessage(body, `API request failed with status ${response.status}`), response.status)
  }

  if (response.status === 204) return undefined as T

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json() as Promise<T>
  return (await response.text()) as T
}
