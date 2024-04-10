import {
  USE_LOCAL_STORAGE_DEFAULT_OPTIONS,
  UseLocalStorageOptions,
} from "localboast/hooks/useLocalStorage"
import UseLocalStorageTextDemo from "./UseLocalStorageUsage"
import UseLocalStorageNumberDemo from "./UseLocalStorageNumberDemo"
import UseLocalStorageArrayDemo from "./UseLocalStorageArrayDemo"
import UseLocalStorageTypedDemo from "./UseLocalStorageTypedDemo"
import UseLocalStorageComplexDemo from "./UseLocalStorageComplexDemo"

export interface UseLocalStorageDemoProps<T = string> {
  /**
   * Local Storage key to use for storing/loading. Can be any string but must be unique
   */
  key: string
  /**
   * Default value to use if no value exists in storage or if value can't be parsed. Can either be the direct value or a function that returns the value
   */
  defaultValue: T | (() => T)
  /**
   * Optional object specifying the custom parse and stringify functions to use if serialization is needed
   */
  options?: UseLocalStorageOptions<T>
  demoType: "string" | "number" | "array" | "typed" | "complex"
}

const UseLocalStorageDemo = ({ demoType }: UseLocalStorageDemoProps) => {
  return (
    <>
      {demoType === "string" && <UseLocalStorageTextDemo />}

      {demoType === "number" && <UseLocalStorageNumberDemo />}

      {demoType === "array" && <UseLocalStorageArrayDemo />}

      {demoType === "typed" && <UseLocalStorageTypedDemo />}

      {demoType === "complex" && <UseLocalStorageComplexDemo />}
    </>
  )
}

UseLocalStorageDemo.defaultProps = {
  options: USE_LOCAL_STORAGE_DEFAULT_OPTIONS,
}

export default UseLocalStorageDemo
