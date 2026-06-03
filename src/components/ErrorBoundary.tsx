import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-lg shadow-sm bg-card">
            <div className="flex justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Oops! Algo deu errado</h1>
            <p className="text-muted-foreground text-sm">
              {this.state.error?.message ||
                'Não foi possível carregar a página devido a um erro inesperado.'}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Recarregar página
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
