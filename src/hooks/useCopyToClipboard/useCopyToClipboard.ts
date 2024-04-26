import copyToClipboard, {
  ClipboardData,
} from "localboast/utils/copyToClipboard"
import { useCallback, useState } from "react"
import useUpdatingRef from "localboast/hooks/useUpdatingRef"
import useTimeout from "../useTimeout"
import { merge } from "localboast/utils/objectHelpers"

export interface UseCopyToClipboardOptions {
  copiedMs?: number
}

export const USE_COPY_TO_CLIPBOARD_DEFAULT_OPTIONS = {
  copiedMs: 1000,
}

const useCopyToClipboard = (
  data: ClipboardData | (() => ClipboardData),
  options?: UseCopyToClipboardOptions,
) => {
  const mergedOptions = merge(USE_COPY_TO_CLIPBOARD_DEFAULT_OPTIONS, options)
  const dataRef = useUpdatingRef(data)
  const [copied, setCopied] = useState(false)

  const clearCopied = useTimeout(
    () => setCopied(false),
    mergedOptions.copiedMs,
    { active: copied },
  )

  return {
    onCopy: useCallback(async () => {
      let data = dataRef.current
      if (typeof data === "function") {
        // if passed in data getter, call it immediately
        data = await data()
      }
      copyToClipboard(data)
      setCopied(true)
    }, [dataRef]),
    copied,
    clearCopied,
  }
}

export default useCopyToClipboard
