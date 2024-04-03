import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"
import { merge } from "localboast/utils/objectHelpers"
import { ComponentPropsWithoutRef, ElementType } from "react"

const DEFAULT_COMPONENT = "div"

export const HAPTIC_DEFAULT_PROPS = {
  ...USE_HAPTIC_DEFAULT_OPTIONS,
  component: DEFAULT_COMPONENT,
}

export type HapticProps<C extends ElementType = typeof DEFAULT_COMPONENT> = {
  /**
   * Custom component or tag name to receive styles
   */
  component?: C
} & UseHapticOptions &
  ComponentPropsWithoutRef<C>

export const Haptic = <C extends ElementType>({
  children,
  ...otherProps
}: HapticProps<C>) => {
  const {
    onClick,
    events,
    focusScaleMultiplier,
    clickScaleMultiplier,
    focusMs,
    blurMs,
    clickMs,
    returnMs,
    component: Component,
    ...otherMergedProps
  } = merge(HAPTIC_DEFAULT_PROPS, otherProps)

  const [{ style: hapticStyle, ...otherHapticProps }] = useHaptic({
    onClick,
    events,
    focusScaleMultiplier,
    clickScaleMultiplier,
    focusMs,
    blurMs,
    clickMs,
    returnMs,
  })

  return (
    <Component
      {...otherMergedProps}
      style={{
        ...hapticStyle,
        height: "fit-content",
        width: "fit-content",
        display: "flex",
        ...otherProps.style,
      }}
      {...otherHapticProps}
    >
      {children}
    </Component>
  )
}

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS

export default Haptic
