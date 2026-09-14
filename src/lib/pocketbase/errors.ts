import { ClientResponseError } from 'pocketbase'

export type FieldErrors = Record<string, string>

function translateErrorMessage(msg: string, fieldName?: string): string {
  if (!msg) return ''
  const trimmed = msg.trim()
  const lower = trimmed.toLowerCase()

  if (lower.includes('must be a valid email') || lower.includes('invalid email')) {
    return 'Informe um endereço de e-mail válido.'
  }
  if (
    lower.includes('cannot be blank') ||
    lower.includes('is required') ||
    lower.includes('required')
  ) {
    return 'Este campo é obrigatório.'
  }
  if (lower.includes('failed to create record')) {
    return 'Falha ao criar registro.'
  }
  if (lower.includes('failed to update record')) {
    return 'Falha ao atualizar registro.'
  }
  if (lower.includes('must be at least') || lower.includes('minimum')) {
    return 'O valor informado está abaixo do limite mínimo permitido.'
  }
  if (lower.includes('must be at most') || lower.includes('maximum')) {
    return 'O valor informado ultrapassa o limite máximo permitido.'
  }
  if (lower.includes('failed to authenticate') || lower.includes('invalid token')) {
    return 'Sessão inválida ou expirada. Faça login novamente.'
  }

  return trimmed
}

export function extractFieldErrors(
  error: unknown,
  fieldLabels?: Record<string, string>,
): FieldErrors {
  if (!(error instanceof ClientResponseError)) return {}
  const data = error.response?.data
  if (!data || typeof data !== 'object') return {}
  const errors: FieldErrors = {}
  for (const [field, detail] of Object.entries(data)) {
    if (
      detail &&
      typeof detail === 'object' &&
      'message' in detail &&
      typeof (detail as { message: unknown }).message === 'string'
    ) {
      const rawMsg = (detail as { message: string }).message
      errors[field] = translateErrorMessage(rawMsg, field)
    }
  }
  return errors
}

export function getErrorMessage(error: unknown, fieldLabels?: Record<string, string>): string {
  if (!(error instanceof ClientResponseError)) {
    return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
  }

  const fieldErrors = extractFieldErrors(error, fieldLabels)
  const entries = Object.entries(fieldErrors)
  if (entries.length > 0) {
    const formatted = entries.map(([field, msg]) => {
      const label = fieldLabels?.[field] || field
      return `${label}: ${msg}`
    })
    return formatted.join(' | ')
  }

  const rawMessage = error.message || ''
  return (
    translateErrorMessage(rawMessage) || 'Ocorreu um erro inesperado ao processar a solicitação.'
  )
}
