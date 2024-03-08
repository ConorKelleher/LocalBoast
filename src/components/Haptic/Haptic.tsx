import { CSSProperties, PropsWithChildren } from "react"
import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"
import { merge } from "localboast/utils/objectHelpers"

export interface HapticProps extends PropsWithChildren, UseHapticOptions {
  style?: CSSProperties
}

export const HAPTIC_DEFAULT_PROPS = {
  ...USE_HAPTIC_DEFAULT_OPTIONS,
}

export const Haptic = ({ children, style, ...otherProps }: HapticProps) => {
  const mergedOptions = merge(HAPTIC_DEFAULT_PROPS, otherProps)
  const [{ style: hapticStyle, ...otherHapticProps }] = useHaptic(mergedOptions)

  return (
    <div
      style={{ ...hapticStyle, display: "flex", ...style }}
      {...otherHapticProps}
    >
      {children}
    </div>
  )
}

export default Haptic
