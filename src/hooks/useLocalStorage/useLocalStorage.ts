import { useCallback, useEffect, useRef, useState } from "react"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import { merge } from "localboast/utils"

// Return type nullable to match JSON.parse return spec
type Parser<T> = (value: string) => T | null
// Return type possibly undefined to match JSON.stringify spec
type Stringifier<T> = (value: T) => string | undefined
export interface UseLocalStorageOptions<T> {
  stringify?: Stringifier<T>
  parse?: Parser<T>
}
export const USE_LOCAL_STORAGE_DEFAULT_OPTIONS = {
  stringify: JSON.stringify,
  parse: JSON.parse,
}

const parseValue = <T>(
  key: string,
  valueToParse: string | null,
  parser: Parser<T>,
  defaultValue: T | null,
) => {
  let parsedValue: T | null = null
  const needsParsing =
    valueToParse &&
    typeof valueToParse === "string" &&
    typeof defaultValue !== "string"
  if (needsParsing) {
    try {
      parsedValue = parser(valueToParse)
    } catch (e) {
      console.warn(
        "useLocalStorage - Failed to parse localStorage string: ",
        valueToParse,
        e,
      )
      localStorage.removeItem(key)
    }
  } else {
    parsedValue = valueToParse as T
  }
  return parsedValue
}
const stringifyValue = <T>(value: T, stringifier: Stringifier<T>) => {
  let stringValue: string | undefined = undefined
  const needsStringifying = typeof value !== "string"

  if (needsStringifying) {
    try {
      stringValue = stringifier(value)
    } catch (e) {
      console.warn(
        "useLocalStorage - Failed to stringify new state value: ",
        value,
        e,
      )
    }
  } else {
    stringValue = value
  }
  return stringValue
}

const getDefaultValue = <T>(defaultValue: T | (() => T) | null) =>
  typeof defaultValue === "function"
    ? (defaultValue as () => T)()
    : defaultValue

const useLocalStorage = <T = string | null>(
  key: string,
  defaultValue: T | (() => T) | null = null,
  options?: UseLocalStorageOptions<T>,
) => {
  const mergedOptions = merge(USE_LOCAL_STORAGE_DEFAULT_OPTIONS, options)
  const mergedOptionsRef = useUpdatingRef(mergedOptions)
  const defaultValueRef = useUpdatingRef(defaultValue)
  const [value, setValue] = useState<T | null>(() => {
    const defaultValueToUse = getDefaultValue<T>(defaultValue)
    const persistedValue = parseValue<T>(
      key,
      localStorage.getItem(key),
      mergedOptions.parse,
      defaultValueToUse,
    )
    return persistedValue === null ? defaultValueToUse : persistedValue
  })
  const lastKeyRef = useRef(key)
  const lastValueRef = useRef(value)

  const writeToLs = useCallback(
    (value: T | null) => {
      const defaultValue = getDefaultValue(defaultValueRef.current)
      const stringValue = stringifyValue<T | null>(
        value,
        mergedOptionsRef.current.stringify,
      )
      const defaultStringValue = defaultValue
        ? stringifyValue<T>(defaultValue, mergedOptionsRef.current.stringify)
        : undefined
      if (stringValue === defaultStringValue) {
        localStorage.removeItem(lastKeyRef.current)
      } else {
        if (stringValue === undefined) {
          // Failed to stringify non-null value, clear LS
          localStorage.removeItem(lastKeyRef.current)
        } else {
          localStorage.setItem(lastKeyRef.current, stringValue)
        }
      }
    },
    [defaultValueRef, mergedOptionsRef],
  )

  const setValueImmediate = useCallback(
    (
      setStateArg: Parameters<
        React.Dispatch<React.SetStateAction<T | null>>
      >[0],
    ) => {
      setValue((oldValue) => {
        const newValue =
          typeof setStateArg === "function"
            ? (setStateArg as (prevState: T | null) => T | null)(oldValue)
            : setStateArg
        writeToLs(newValue)
        return newValue
      })
    },
    [writeToLs],
  )

  // Update state with correct LS value when key changes
  useEffect(() => {
    if (lastKeyRef.current !== key) {
      const newStringValue = localStorage.getItem(key)
      let newParsedValue = parseValue<T>(
        key,
        newStringValue,
        mergedOptionsRef.current.parse,
        getDefaultValue(defaultValueRef.current),
      )
      if (newParsedValue === null) {
        newParsedValue = getDefaultValue(defaultValueRef.current)
      }
      setValue(newParsedValue)
      lastKeyRef.current = key
    }
  }, [key, mergedOptionsRef, defaultValueRef])

  // When state value updates, either update or remove LS value
  useEffect(() => {
    if (lastValueRef.current !== value) {
      writeToLs(value)
      lastValueRef.current = value
    }
  }, [value, writeToLs])

  // When localStorage updates outside of our doing, sync our state
  useEffect(() => {
    const onStorageUpdate = (e: StorageEvent) => {
      if (
        e.storageArea === window.localStorage &&
        e.key === lastKeyRef.current
      ) {
        const parsedValue = parseValue<T>(
          lastKeyRef.current,
          e.newValue,
          mergedOptionsRef.current.parse,
          getDefaultValue(defaultValueRef.current),
        )
        const newValue =
          parsedValue === null
            ? getDefaultValue(defaultValueRef.current)
            : parsedValue
        setValue(newValue)
      }
    }
    window.addEventListener("storage", onStorageUpdate)

    return () => {
      window.removeEventListener("storage", onStorageUpdate)
    }
  }, [mergedOptionsRef, defaultValueRef])

  const remove = useCallback(() => {
    // Set local state - will trigger above useEffect to remove LS
    setValue(getDefaultValue(defaultValueRef.current))
  }, [defaultValueRef])

  return [value, setValueImmediate, remove] as const
}

export default useLocalStorage
