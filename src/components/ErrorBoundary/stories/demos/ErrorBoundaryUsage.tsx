import ErrorBoundary, {
  ErrorBoundaryReturnValues,
} from "localboast/components/ErrorBoundary"
import { useState } from "react"

export const ErrorBoundaryDemo = () => {
  return (
    <ErrorBoundary>
      {(errorValues: ErrorBoundaryReturnValues) => (
        <ErrorBoundaryChild {...errorValues} />
      )}
    </ErrorBoundary>
  )
}

export const ErrorBoundaryChild = ({
  error,
  resetError,
}: ErrorBoundaryReturnValues) => {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error("I have a complaint!")
  }

  return error ? (
    <div style={{ display: "flex", flexDirection: "column" }}>
      Ruh-roh!
      {error.message}
      <button onClick={resetError}>Clear Error</button>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column" }}>
      There is no error yet. This button will create one though :O
      <button
        onClick={() => {
          setShouldError(true)
        }}
      >
        You know you want to click me
      </button>
    </div>
  )
}
