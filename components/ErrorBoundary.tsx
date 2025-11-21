'use client'

// Error Boundary - gracefully handles unexpected errors
// Built with care because even error states deserve good design 🛡️
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    // In production, you could send this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error
  resetError: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-text mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-text/70 mb-8">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-8 text-left bg-text/5 p-4 rounded-lg border border-text/10">
            <summary className="cursor-pointer text-sm font-semibold text-text mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-text/60 overflow-auto">
              {error.toString()}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={resetError}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-text/10 text-text rounded-lg hover:bg-text/20 transition-colors font-medium"
          >
            Refresh page
          </button>
        </div>
      </div>
    </div>
  )
}

