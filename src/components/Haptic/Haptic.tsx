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

type _HapticProps = UseHapticOptions

export const Haptic = withPolymorphism<_HapticProps, DEFAULT_COMPONENT>(
  (props, ref) => {
    const mergedProps = merge(HAPTIC_DEFAULT_PROPS, props)
    const [useHapticOptions, otherProps] = collectEnumValues(
      mergedProps,
      UseHapticOptionsKeys,
    )
    const { component: Component, ...polymorphicProps } = otherProps

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

export type HapticProps<C extends ElementType> = PolymorphicProps<
  _HapticProps,
  C
>

Haptic.defaultProps = HAPTIC_DEFAULT_PROPS

export default Haptic
