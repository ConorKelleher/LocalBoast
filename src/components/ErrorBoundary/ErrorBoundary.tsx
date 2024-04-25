import { Component, type ReactNode } from "react"
import { merge } from "localboast/utils/objectHelpers"

export interface ErrorBoundaryProps {
  children?: (callbackArgs: {
    error: Error | undefined
    resetError: () => void
  }) => ReactNode
  logger?: (error: Error, errorInfo: unknown) => void
}

export const ERROR_BOUNDARY_DEFAULT_PROPS = {
  logger: console.error,
}

export interface ErrorBoundaryState {
  error: Error | undefined
}

export interface ErrorBoundaryReturnValues {
  error: Error | undefined
  resetError: () => void
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
    const { logger } = this.getMergedProps()
    if (logger) {
      logger(error, errorInfo)
    }
  }

  getMergedProps = () => {
    return merge(ERROR_BOUNDARY_DEFAULT_PROPS, this.props)
  }

  resetError = () => {
    this.setState({ error: undefined })
  }

  render = () => {
    const { children } = this.getMergedProps()
    return children
      ? children({
          error: this.state.error,
          resetError: this.resetError,
        } as ErrorBoundaryReturnValues)
      : null
  }
}

export default ErrorBoundary
