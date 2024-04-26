import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"
import {
  withPolymorphism,
  PolymorphicComponentProps,
  PolymorphicExtraProps,
} from "localboast/internal/polymorphism"
import { merge } from "localboast/utils/objectHelpers"
import { ElementType, forwardRef, PropsWithChildren } from "react"

const DEFAULT_COMPONENT = "div"
type DEFAULT_COMPONENT = typeof DEFAULT_COMPONENT

export const HAPTIC_DEFAULT_PROPS = {
  ...USE_HAPTIC_DEFAULT_OPTIONS,
  component: DEFAULT_COMPONENT,
}

type _HapticProps = UseHapticOptions & PropsWithChildren & PolymorphicExtraProps
export type HapticProps<C extends ElementType = DEFAULT_COMPONENT> =
  PolymorphicComponentProps<C, _HapticProps>

export const Haptic = withPolymorphism<DEFAULT_COMPONENT, _HapticProps>(
  forwardRef<HTMLElement, _HapticProps>(({ children, ...otherProps }, ref) => {
    const {
      onClick,
      events,
      focusScaleMultiplier,
      clickScaleMultiplier,
      focusMs,
      blurMs,
      clickMs,
      returnMs,
      animateReturn,
      type,
      rotationVector,
      focusRotation,
      clickRotation,
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
      animateReturn,
      type,
      rotationVector,
      focusRotation,
      clickRotation,
    })

    return (
      <Component
        ref={ref}
        {...otherMergedProps}
        style={{
          ...hapticStyle,
          height: "fit-content",
          width: "fit-content",
          display: "flex",
          ...otherMergedProps.style,
        }}
        {...otherHapticProps}
      >
        {children}
      </Component>
    )
  }),
)

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS
Haptic.displayName = "Haptic"

export default Haptic
