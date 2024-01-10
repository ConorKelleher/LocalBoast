interface DebounceOptions {
  ms?: number
  maxDebounceMs?: number
}

const DEFAULT_DEBOUNCE_OPTIONS = {
  ms: 250,
  maxDebounceMs: undefined,
}

const debounce = (funcToDebounce: () => void, options?: DebounceOptions) => {
  const mergedOptions = {
    ...DEFAULT_DEBOUNCE_OPTIONS,
    ...options,
  }
  let timeoutReference: NodeJS.Timeout | null = null
  let initialTime: number
  let debouncedFunction: () => void

  return () => {
    if (timeoutReference) {
      const currentTime = new Date().getTime()
      clearTimeout(timeoutReference)
      timeoutReference = null
      if (
        mergedOptions.maxDebounceMs &&
        currentTime - initialTime > mergedOptions.maxDebounceMs
      ) {
        debouncedFunction()
        return
      }
    } else {
      initialTime = new Date().getTime()
    }
    debouncedFunction = funcToDebounce
    timeoutReference = setTimeout(() => {
      timeoutReference = null
      funcToDebounce()
    }, mergedOptions.ms)
  }
}

export default debounce
