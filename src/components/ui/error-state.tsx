import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home, Bug, WifiOff, ServerCrash } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: any
  errorCode?: string | number
  retryText?: string
  onRetry?: () => void
  showHomeButton?: boolean
  fullScreen?: boolean
  variant?: 'default' | 'not-found' | 'network' | 'server'
}

// Error type variants with specific icons and styling
const errorVariants = {
  default: {
    icon: AlertCircle,
    gradient: 'from-brand-error/10 to-brand-error/5',
    iconBg: 'bg-brand-error/10',
    iconColor: 'text-brand-error',
  },
  'not-found': {
    icon: Bug,
    gradient: 'from-brand-warning/10 to-brand-warning/5',
    iconBg: 'bg-brand-warning/10',
    iconColor: 'text-brand-warning',
  },
  network: {
    icon: WifiOff,
    gradient: 'from-brand-primary/10 to-brand-primary/5',
    iconBg: 'bg-brand-primary-soft',
    iconColor: 'text-brand-primary',
  },
  server: {
    icon: ServerCrash,
    gradient: 'from-brand-error/10 to-brand-error/5',
    iconBg: 'bg-brand-error/10',
    iconColor: 'text-brand-error',
  },
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  error,
  errorCode,
  retryText = 'Try Again',
  onRetry,
  showHomeButton = true,
  fullScreen = true,
  variant = 'default',
}: ErrorStateProps) {
  const errorMessage = error?.message || message
  const errorDetails = error?.details || error?.response?.data?.message
  const VariantIcon = errorVariants[variant].icon
  const variantStyles = errorVariants[variant]

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-center p-6 sm:p-8 max-w-md mx-auto"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
        className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${variantStyles.iconBg} mb-6 shadow-sm`}
      >
        <VariantIcon className={`h-10 w-10 sm:h-12 sm:w-12 ${variantStyles.iconColor}`} />
      </motion.div>

      {/* Title & Message */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark mb-3">
        {title}
      </h1>
      <p className="text-brand-muted text-sm sm:text-base mb-4 leading-relaxed">
        {errorMessage}
      </p>

      {/* Error Code & Details */}
      {(errorCode || errorDetails) && (
        <div className="mb-6 p-3 sm:p-4 bg-brand-surface rounded-lg border border-brand-primary-soft">
          {errorCode && (
            <div className="text-xs font-mono text-brand-muted mb-2">
              Error Code: <span className="text-brand-primary font-semibold">{errorCode}</span>
            </div>
          )}
          {errorDetails && (
            <details className="text-left">
              <summary className="text-xs text-brand-muted cursor-pointer hover:text-brand-primary transition-colors">
                Technical Details
              </summary>
              <pre className="mt-2 text-[10px] sm:text-xs text-brand-muted bg-white p-2 rounded overflow-auto max-h-32">
                {typeof errorDetails === 'string' 
                  ? errorDetails 
                  : JSON.stringify(errorDetails, null, 2)
                }
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-brand-primary text-white hover:bg-brand-primary-hover shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-6 py-2.5"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {retryText}
          </Button>
        )}
        
        {showHomeButton && (
          <Button 
            variant="outline" 
            asChild
            className="border-brand-primary-soft text-brand-dark hover:bg-brand-primary-soft hover:border-brand-primary transition-all duration-300 rounded-lg px-6 py-2.5"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        )}
      </div>

      {/* Help Text */}
      <p className="text-xs text-brand-muted mt-6">
        Need help?{' '}
        <Link 
          to="/support" 
          className="text-brand-primary hover:underline font-medium transition-colors"
        >
          Contact Support
        </Link>
      </p>
    </motion.div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-surface/50 to-transparent" />
        <div className="relative">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-xl border border-brand-primary-soft shadow-sm">
      {content}
    </div>
  )
}

// Specialized error components for common scenarios
export function NotFoundError() {
  return (
    <ErrorState
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      variant="not-found"
      errorCode={404}
      showHomeButton={true}
      onRetry={undefined}
    />
  )
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection."
      variant="network"
      onRetry={onRetry}
      retryText="Retry Connection"
    />
  )
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server Error"
      message="Our servers are experiencing issues. Please try again later."
      variant="server"
      errorCode={500}
      onRetry={onRetry}
      retryText="Try Again"
    />
  )
}

// Usage example with error boundary integration
export function withErrorState<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorStateProps>
) {
  return function WithErrorStateWrapper(props: P & { error?: any }) {
    const { error, ...restProps } = props
    
    if (error) {
      return (
        <ErrorState
          error={error}
          {...options}
        />
      )
    }
    
    return <Component {...(restProps as P)} />
  }
}