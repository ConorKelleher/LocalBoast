import useHaptic, {
  USE_HAPTIC_DEFAULT_OPTIONS,
  UseHapticOptionsKeys,
  UseHapticOptions,
} from "localboast/hooks/useHaptic"
import { collectEnumValues } from "localboast/internal/assertTypes"
import {
  withPolymorphism,
  PolymorphicProps,
} from "localboast/internal/polymorphism"
import { merge } from "localboast/utils/objectHelpers"
import { ElementType } from "react"

const DEFAULT_COMPONENT = "div"
type DEFAULT_COMPONENT = typeof DEFAULT_COMPONENT

export const HAPTIC_DEFAULT_PROPS = {
  component: DEFAULT_COMPONENT,
  ...USE_HAPTIC_DEFAULT_OPTIONS,
}

interface _HapticProps extends UseHapticOptions {}

export const Haptic = withPolymorphism<_HapticProps, DEFAULT_COMPONENT>(
  (props, ref) => {
    const mergedProps = merge(HAPTIC_DEFAULT_PROPS, props)
    const [useHapticOptions, otherProps] = collectEnumValues(
      mergedProps,
      UseHapticOptionsKeys,
    )
    const { component, ...polymorphicProps } = otherProps
    const Component = component as ElementType

    const [{ style: hapticStyle, ...otherUseHapticProps }] =
      useHaptic(useHapticOptions)

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
        {...otherUseHapticProps}
      />
    )
  },
  "Haptic",
)

// polymorphic component not getting props documented

export type HapticProps<C extends ElementType = DEFAULT_COMPONENT> =
  PolymorphicProps<_HapticProps, C>

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS

export default Haptic
