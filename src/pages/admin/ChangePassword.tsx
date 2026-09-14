import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { changeAdminPassword } from '@/services/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ChangePassword() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    oldPassword?: string
    password?: string
    passwordConfirm?: string
  }>({})

  const validate = () => {
    const errors: typeof fieldErrors = {}

    if (!oldPassword.trim()) {
      errors.oldPassword = 'A senha atual é obrigatória.'
    }

    if (!password) {
      errors.password = 'A nova senha é obrigatória.'
    } else if (password.length < 8) {
      errors.password = 'A nova senha deve conter no mínimo 8 caracteres.'
    } else if (oldPassword && password === oldPassword) {
      errors.password = 'A nova senha deve ser diferente da senha atual.'
    }

    if (!passwordConfirm) {
      errors.passwordConfirm = 'Confirme a nova senha.'
    } else if (password && password !== passwordConfirm) {
      errors.passwordConfirm = 'As senhas não coincidem. Digite a mesma senha em ambos os campos.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      await changeAdminPassword({
        oldPassword,
        password,
        passwordConfirm,
      })

      setSuccessMessage('Sua senha foi alterada com sucesso! Sua sessão continua ativa.')
      setOldPassword('')
      setPassword('')
      setPasswordConfirm('')
      setFieldErrors({})
    } catch (err: any) {
      const responseData = err?.response?.data

      if (responseData && typeof responseData === 'object') {
        const errors: typeof fieldErrors = {}

        if (responseData.oldPassword) {
          errors.oldPassword = 'Senha atual incorreta. Verifique e tente novamente.'
        }
        if (responseData.password) {
          const pbMsg = responseData.password.message || ''
          if (pbMsg.toLowerCase().includes('min') || pbMsg.toLowerCase().includes('length')) {
            errors.password = 'A nova senha deve conter no mínimo 8 caracteres.'
          } else {
            errors.password = responseData.password.message || 'Nova senha inválida.'
          }
        }
        if (responseData.passwordConfirm) {
          errors.passwordConfirm = 'A confirmação de senha não coincide com a nova senha.'
        }

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          setErrorMessage('Por favor, corrija os erros apontados abaixo.')
          return
        }
      }

      const msg = err?.message || ''
      if (
        msg.toLowerCase().includes('old password') ||
        msg.toLowerCase().includes('failed to update') ||
        err?.status === 400
      ) {
        setErrorMessage(
          'Não foi possível alterar a senha. Verifique se a senha atual está correta.',
        )
        setFieldErrors((prev) => ({
          ...prev,
          oldPassword: 'Senha atual incorreta ou inválida.',
        }))
      } else {
        setErrorMessage(msg || 'Ocorreu um erro ao alterar a senha. Tente novamente mais tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/admin">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alterar Senha</h1>
          <p className="text-sm text-muted-foreground">
            Atualize sua senha de acesso administrativo ao sistema.
          </p>
        </div>
      </div>

      {successMessage && (
        <Alert className="border-green-600 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-300">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="font-semibold">Senha atualizada com sucesso!</AlertTitle>
          <AlertDescription className="text-sm">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">Não foi possível alterar a senha</AlertTitle>
          <AlertDescription className="text-sm">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Credenciais de Acesso</CardTitle>
              <CardDescription>
                Usuário logado:{' '}
                <strong className="text-foreground">{user?.email || 'Administrador'}</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword">
                Senha Atual <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value)
                    if (fieldErrors.oldPassword) {
                      setFieldErrors((prev) => ({ ...prev, oldPassword: undefined }))
                    }
                  }}
                  className={fieldErrors.oldPassword ? 'border-destructive pr-10' : 'pr-10'}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showOldPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.oldPassword && (
                <p className="text-sm text-destructive">{fieldErrors.oldPassword}</p>
              )}
            </div>

            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Nova Senha <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo de 8 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }))
                    }
                  }}
                  className={fieldErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  A nova senha deve ter no mínimo 8 caracteres e ser diferente da atual.
                </p>
              )}
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">
                Confirmar Nova Senha <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="Repita a nova senha"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value)
                    if (fieldErrors.passwordConfirm) {
                      setFieldErrors((prev) => ({ ...prev, passwordConfirm: undefined }))
                    }
                  }}
                  className={fieldErrors.passwordConfirm ? 'border-destructive pr-10' : 'pr-10'}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPasswordConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.passwordConfirm && (
                <p className="text-sm text-destructive">{fieldErrors.passwordConfirm}</p>
              )}
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Para sua segurança, a alteração exige a confirmação da sua senha atual. Após salvar,
                sua sessão permanecerá ativa normalmente com a nova credencial.
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setOldPassword('')
                setPassword('')
                setPasswordConfirm('')
                setFieldErrors({})
                setErrorMessage('')
                setSuccessMessage('')
              }}
            >
              Limpar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
