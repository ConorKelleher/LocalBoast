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
import { ElementType, PropsWithChildren } from "react"

const DEFAULT_COMPONENT = "div"
type DEFAULT_COMPONENT = typeof DEFAULT_COMPONENT

export const HAPTIC_DEFAULT_PROPS = {
  ...USE_HAPTIC_DEFAULT_OPTIONS,
  component: DEFAULT_COMPONENT as ElementType,
}

type _HapticProps = UseHapticOptions & PropsWithChildren & PolymorphicExtraProps
export type HapticProps<C extends ElementType = DEFAULT_COMPONENT> =
  PolymorphicComponentProps<C, _HapticProps>

export const Haptic = withPolymorphism<DEFAULT_COMPONENT, _HapticProps>(
  ({ children, ...otherProps }, ref) => {
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
      initialScale,
      initialRotation,
      component: Component,
      ...polymorphicProps
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
      initialScale,
      initialRotation,
    })

    return (
      <Component
        ref={ref}
        {...polymorphicProps}
        style={{
          ...hapticStyle,
          height: "fit-content",
          width: "fit-content",
          display: "flex",
          ...polymorphicProps.style,
        }}
        {...otherHapticProps}
      >
        {children}
      </Component>
    )
  },
  "Haptic",
)

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS

export default Haptic
