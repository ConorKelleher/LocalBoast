import { useCallback, useEffect, useRef, useState } from "react"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"

// Return type nullable to match JSON.parse return spec
type Parser = <T>(value: string) => T | null
// Return type possibly undefined to match JSON.stringify spec
type Stringifier = <T>(value: T) => string | undefined
export interface UseLocalStorageOptions {
  stringify?: Stringifier
  parse?: Parser
}
export const USE_LOCAL_STORAGE_DEFAULT_OPTIONS = {
  stringify: JSON.stringify,
  parse: JSON.parse,
}

const parseValue = <T>(key: string, value: string | null, parser?: Parser) => {
  let parsedValue: T | null = null
  if (typeof value !== "string" || !parser) {
    parsedValue = value as T
  } else if (value) {
    try {
      parsedValue = parser<T>(value)
    } catch (e) {
      console.warn(
        "useLocalStorage - Failed to parse localStorage string: ",
        value,
        e,
      )
      localStorage.removeItem(key)
    }
  }
  return parsedValue
}
const stringifyValue = <T>(value: T, stringifier?: Stringifier) => {
  let stringValue: string | undefined = undefined
  if (typeof value === "string" || !stringifier) {
    stringValue = value as string
  } else if (value) {
    try {
      stringValue = stringifier<T>(value)
    } catch (e) {
      console.warn(
        "useLocalStorage - Failed to stringify new state value: ",
        value,
        e,
      )
    }
  }
  return stringValue
}

const useLocalStorage = <T = string>(
  key: string,
  options?: UseLocalStorageOptions,
) => {
  const optionsRef = useUpdatingRef(options)
  const [value, setValue] = useState<T | null>(() =>
    parseValue<T>(key, localStorage.getItem(key), options?.parse),
  )
  const lastKeyRef = useRef(key)
  const lastValueRef = useRef(value)

  // Update state with correct LS value when key changes
  useEffect(() => {
    if (lastKeyRef.current !== key) {
      const newStringValue = localStorage.getItem(key)
      const newParsedValue = parseValue<T>(
        key,
        newStringValue,
        optionsRef.current?.parse,
      )
      setValue(newParsedValue)
      lastKeyRef.current = key
    }
  }, [key, optionsRef])

  // When state value updates, either update or remove LS value
  useEffect(() => {
    if (lastValueRef.current !== value) {
      if (value === null) {
        localStorage.removeItem(lastKeyRef.current)
      } else {
        const stringValue = stringifyValue<T>(value, options?.stringify)
        if (stringValue === undefined) {
          // Failed to stringify non-null value, clear LS
          localStorage.removeItem(lastKeyRef.current)
        } else {
          localStorage.setItem(lastKeyRef.current, stringValue)
        }
      }
      lastValueRef.current = value
    }
  }, [value, options?.stringify])

  // When localStorage updates outside of our doing, sync our state
  useEffect(() => {
    const onStorageUpdate = (e: StorageEvent) => {
      if (
        e.storageArea === window.localStorage &&
        e.key === lastKeyRef.current
      ) {
        setValue(
          parseValue(lastKeyRef.current, e.newValue, optionsRef.current?.parse),
        )
      }
    }
    window.addEventListener("storage", onStorageUpdate)

    return () => {
      window.removeEventListener("storage", onStorageUpdate)
    }
  }, [optionsRef])

  const remove = useCallback(() => {
    // Set local state - will trigger above useEffect to remove LS
    setValue(null)
  }, [])

  return [value, setValue, remove] as const
}

export default useLocalStorage
