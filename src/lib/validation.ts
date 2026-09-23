export type ValidationErrors = Record<string, string>

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
export const isNonNegativeNumber = (value: string) => value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0

export function validateAuthForm(email: string, password: string): ValidationErrors {
  const errors: ValidationErrors = {}
  if (!email.trim()) errors.email = 'El correo es requerido.'
  else if (!isValidEmail(email)) errors.email = 'Ingresa un correo válido.'
  if (!password) errors.password = 'La contraseña es requerida.'
  return errors
}

export function validateRegistrationForm(companyName: string, email: string, password: string): ValidationErrors {
  const errors = validateAuthForm(email, password)
  if (!companyName.trim()) errors.companyName = 'El nombre de la empresa es requerido.'
  if (password && password.length < 6) errors.password = 'Debe tener al menos 6 caracteres.'
  return errors
}
