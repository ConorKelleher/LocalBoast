import ErrorBoundary, {
  ErrorBoundaryProps,
  ERROR_BOUNDARY_DEFAULT_PROPS,
  ErrorBoundaryReturnValues,
} from "localboast/components/ErrorBoundary"
import { ErrorBoundaryChild } from "./ErrorBoundaryUsage"

export const ErrorBoundaryDemo = (props: ErrorBoundaryProps) => {
  return (
    <ErrorBoundary logger={props.logger}>
      {(errorValues: ErrorBoundaryReturnValues) => (
        <ErrorBoundaryChild {...errorValues} />
      )}
    </ErrorBoundary>
  )
}

ErrorBoundaryDemo.defaultProps = ERROR_BOUNDARY_DEFAULT_PROPS

export default ErrorBoundaryDemo
