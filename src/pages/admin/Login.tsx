import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'

export default function Login() {
  const { signIn, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.')
      setLoading(false)
    } else {
      navigate('/admin', { replace: true })
    }
  }

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    setRecoveryLoading(true)
    try {
      await pb.collection('users').requestPasswordReset(recoveryEmail)
    } catch {
      // Silently ignore errors to avoid disclosing account existence
    }
    setRecoverySent(true)
    setRecoveryLoading(false)
    setTimeout(() => {
      setForgotMode(false)
      setRecoverySent(false)
      setRecoveryEmail('')
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">ibisoft Admin</CardTitle>
          <CardDescription>
            {forgotMode
              ? 'Recuperação de senha'
              : 'Faça login para acessar o painel administrativo'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotMode ? (
            recoverySent ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center py-4">
                  Se o e-mail informado estiver cadastrado, você receberá um link de recuperação de
                  senha em instantes.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    setForgotMode(false)
                    setRecoverySent(false)
                    setRecoveryEmail('')
                  }}
                >
                  Voltar para o login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">E-mail</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="admin@ibisoft.com.br"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={recoveryLoading}>
                  {recoveryLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setForgotMode(false)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Button>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ibisoft.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-10"
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
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotMode(true)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
              <div className="mt-6 pt-4 border-t">
                <Link
                  to="/"
                  className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o site
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
