import { Component, type ReactNode } from "react"

export interface ErrorBoundaryProps {
  children: (callbackArgs: {
    error: Error | undefined
    resetError: () => void
  }) => ReactNode
  logger?: (error: Error, errorInfo: unknown) => void
}

export interface ErrorBoundaryState {
  error: Error | undefined
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  hrefObserver: undefined | MutationObserver = undefined

  componentDidMount = () => {
    let oldHref = document.location.href
    this.hrefObserver = new MutationObserver(() => {
      if (oldHref !== document.location.href) {
        oldHref = document.location.href
        if (this.state.error) {
          // Href changing - user has taken some navigation action - clear error
          this.resetError()
        }
      }
    })

    const body = document.querySelector("body")
    if (!body) {
      return
    }
    this.hrefObserver.observe(body, { childList: true, subtree: true })
  }

  componentWillUnmount = () => {
    if (this.hrefObserver) {
      this.hrefObserver.disconnect()
      this.hrefObserver = undefined
    }
  }

  componentDidCatch = (error: Error, errorInfo: unknown) => {
    // You can also log the error to an error reporting service
    if (this.props.logger) {
      this.props.logger(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ error: undefined })
  }

  render = () => {
    return this.props.children({
      error: this.state.error,
      resetError: this.resetError,
    })
  }
}

export default ErrorBoundary
